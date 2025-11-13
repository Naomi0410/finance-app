import bcrypt from "bcryptjs";
import { User } from "@/types/user";
import { MongoClient, ServerApiVersion } from "mongodb"
 
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}
const isProd = process.env.VERCEL_ENV === 'production';

const dbName = isProd ? 'finance' : 'finance-test';

const uri = process.env.MONGODB_URI
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}
 
let client: MongoClient
 
if (!isProd) {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient
  }
 
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options)
  }
  client = globalWithMongo._mongoClient
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
}
 
export default client

// ✅ Get user by email
export async function getUser(email: string): Promise<User | null> {
  await client.connect();
  const db = client.db(dbName);
  return db.collection<User>("users").findOne({ email });
}

// ✅ Create new user
export async function createUser(name: string, email: string, password: string) {
  await client.connect();
  const db = client.db(dbName);
  const hashedPassword = await bcrypt.hash(password, 10);
  return db.collection("users").insertOne({ name, email, password: hashedPassword });
}