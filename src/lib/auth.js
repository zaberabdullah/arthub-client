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
  
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false, // <-- true থেকে false করো। নাহলে যেকেউ admin বানায় ফেলতে পারবে
      },
    },
  },
  
  session: { expiresIn: 60 * 60 * 24 * 7 },
});