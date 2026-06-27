import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export const auth = betterAuth({
  database: mongodbAdapter(await clientPromise.then(c => c.db(process.env.MONGODB_DB))),
  secret: process.env.BETTER_AUTH_SECRET,
  
  baseURL: "http://localhost:3000", 
  trustedOrigins: [
    "http://localhost:3000", 
    "http://localhost:5000"  
  ],

  emailAndPassword: { enabled: true },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user", // Default user
        input: false, 
      },
      pendingRole: {
        type: "string",
        defaultValue: null,
        input: false,
      },
    },
  },

  // ✅ Google login এর আগে role capture করার জন্য
  callbacks: {
    async signIn({ user, account }) {
      // Google দিয়ে login করলে pendingRole check করো
      if (account?.provider === "google" && user.pendingRole) {
        // Role update করো
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        await db.collection("user").updateOne(
          { _id: user.id },
          { 
            $set: { 
              role: user.pendingRole,
              pendingRole: null 
            } 
          }
        );
      }
      return true;
    },
  },
  
  session: { expiresIn: 60 * 60 * 24 * 7 },
});