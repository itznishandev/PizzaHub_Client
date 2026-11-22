import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://bazardor:S8TbSyMK%402hdBUU@bazardor.anxfedh.mongodb.net/pizzahub_db?retryWrites=true&w=majority&appName=bazardor";

const client = new MongoClient(uri);

const effectiveBaseURL =
  process.env.BETTER_AUTH_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

export const auth = betterAuth({
  database: mongodbAdapter(client.db(process.env.MONGODB_DB || "pizzahub_db")),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            prompt: "select_account",
          },
        }
      : {}),
  },
  secret: process.env.BETTER_AUTH_SECRET || "t06COGp5XEBVzx6QdXI4eojlrnFaZAYO",
  baseURL: effectiveBaseURL,
  trustedOrigins: [
    "http://localhost:3000",
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
});
