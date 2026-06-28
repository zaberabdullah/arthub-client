import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const client = new MongoClient(process.env.MONGODB_URI);
const clientPromise = client.connect();

export const auth = betterAuth({
  database: mongodbAdapter(await clientPromise.then(c => c.db(process.env.MONGODB_DB || "arthub"))),
  
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  
   trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:5000",
    "https://arthub-client-three.vercel.app",
    "https://arthub-server-mu.vercel.app",
  ],
 advanced: {
    crossSubdomainCookies: {
      enabled: false,
    },
    defaultCookieAttributes: {
      secure: true,
      httpOnly: true,
      sameSite: "none", // ← cross-origin request এর জন্য
    },
  },
  
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
        defaultValue: "user",
        input: false,
      },
      pendingRole: {
        type: "string",
        defaultValue: null,
        input: false,
      },
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.pendingRole) {
        const c = await clientPromise;
        const db = c.db(process.env.MONGODB_DB || "arthub");
        await db.collection("user").updateOne(
          { _id: user.id },
          { $set: { role: user.pendingRole, pendingRole: null } }
        );
      }
      return true;
    },
  },

  session: { expiresIn: 60 * 60 * 24 * 7 },
});

export default auth;