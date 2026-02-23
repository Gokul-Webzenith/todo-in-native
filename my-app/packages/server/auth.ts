import dotenv from "dotenv";

dotenv.config({
  path: "../../.env",
});

import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { getDb, user, session, account } from "./../db/src";


const db = getDb();

const AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
const APP_URL = process.env.APP_URL;

if (!AUTH_SECRET) {
  throw new Error("❌ BETTER_AUTH_SECRET is missing.");
}

if (!APP_URL) {
  throw new Error("❌ APP_URL is missing.");
}

export const auth = betterAuth({
  
  plugins: [expo()],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
    },
  }),

  trustedOrigins: ["http://localhost:3001",  "coolapp://","exp://","http://192.168.1.18:3000","http://localhost:3000"],

  secret: AUTH_SECRET,
  baseURL: APP_URL,

  emailAndPassword: {
    enabled: true,
  },
  
    cookies: {
    sameSite: "none",   // 🔴 REQUIRED
    secure: false,
    path: "/", 
  },

});
