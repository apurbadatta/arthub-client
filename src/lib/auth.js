import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import dns from "node:dns/promises";
import { jwt } from "better-auth/plugins";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("artHub_DB");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client
  }),

  emailAndPassword: { 
    enabled: true, 
  },

  socialProviders: {
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    }
  },

  // 🔥 Better Auth-এ রোল (Role) ফিল্ডটি ডেটাবেজে এলাও করার জন্য এই কাস্টম ইউজার স্কিমা যোগ করুন
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user", // ফ্রন্টএন্ড থেকে কিছু না পাঠালে ডিফল্ট রোল হবে 'user'
      },
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      //max 7days
      maxAge: 7 * 24 * 60 * 60
    }
  },

  plugins: [
    jwt()
  ]
});