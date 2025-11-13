import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";
import { getUser } from "./mongodb";
import type { Account, Profile, User } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/mongodb";
import type { SessionStrategy } from "next-auth";

export const authOptions = {
  adapter: MongoDBAdapter(client),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        const user = await getUser(credentials.email);
        if (!user) {
          console.log("❌ User not found");
          return null;
        }

        if (!user.password) {
          console.log("❌ User has no password set");
          return null;
        }

        const passwordsMatch = await compare(
          credentials.password,
          user.password
        );
        if (!passwordsMatch) {
          console.log("❌ Password mismatch");
          return null;
        }

        console.log("✅ Credentials valid, logging in user:", user.email);

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async signIn(params: {
      user: User | AdapterUser;
      account: Account | null;
      profile?: Profile;
      email?: { verificationRequest?: boolean };
      credentials?: Record<string, unknown>;
    }) {
      const { user, account } = params;

      if (account?.provider === "google") {
        // Only check emailVerified for Google accounts
        if (!("emailVerified" in user)) {
          return false;
        }

        const db = client.db();
        const usersCollection = db.collection("users");
        const accountsCollection = db.collection("accounts");

        const existingUser = await usersCollection.findOne({
          email: user.email,
        });

        if (existingUser) {
          const linkedAccount = await accountsCollection.findOne({
            provider: "google",
            providerAccountId: account.providerAccountId,
          });

          if (!linkedAccount) {
            await accountsCollection.insertOne({
              userId: existingUser._id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              expires_at: account.expires_at,
            });
          }

          return true;
        }

        // Allow sign-in for new Google users
        return true;
      }

      // Allow credentials login without blocking
      return true;
    },
  },
};
