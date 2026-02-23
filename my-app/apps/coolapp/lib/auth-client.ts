import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: "http://192.168.1.18:3000/api/auth",

  fetchOptions: {
    credentials: "include", // ✅ VERY IMPORTANT
  },

  plugins: [
    expoClient({
      scheme: "coolapp",
      storagePrefix: "coolapp",
      storage: SecureStore,
    }),
  ],
});