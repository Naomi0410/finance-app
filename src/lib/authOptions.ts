import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";
import { getUser } from "./mongodb";
import type { Account } from "next-auth";
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
        if (!credentials?.email || !credentials?.password) return null;

        const user = await getUser(credentials.email);
        if (!user || !user.password) return null;

        const passwordsMatch = await compare(
          credentials.password,
          user.password
        );
        if (!passwordsMatch) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({
      user,
      account,
    }: {
      user: AdapterUser;
      account: Account | null;
    }) {
      if (account?.provider === "google") {
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
      }

      return true;
    },
  },
};
