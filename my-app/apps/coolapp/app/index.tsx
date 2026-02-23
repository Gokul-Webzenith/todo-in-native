import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  authSchema,
  type AuthType,
} from "@repo/schemas";

import { useAuthStore } from "@repo/store";
import { authClient } from "../lib/auth-client";

import { useSession } from "../hooks/useSession";

import { useQueryClient } from "@tanstack/react-query";

export default function AuthScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  
  const { data: user, isLoading } = useSession();

  const {
    mode,
    message,
    setMessage,
    togglePassword,
    showpassword,
    toggleMode,
    clearMessage,
  } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AuthType>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  
  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/work");
    }
  }, [user, isLoading]);

  useEffect(() => {
    reset({
      email: "",
      password: "",
      name: undefined,
    });
  }, [mode]);

  async function onSubmit(data: AuthType) {
    clearMessage();

    if (mode === "signup" && !data.name) {
      setMessage("Name is required");
      return;
    }

    try {
      if (mode === "login") {
        const res = await authClient.signIn.email({
          email: data.email,
          password: data.password,
        });

        if (!res || res.error || !res.data?.user) {
          setMessage("Invalid email or password");
          return;
        }

        await queryClient.invalidateQueries({
          queryKey: ["session"],
        });

        router.replace("/work");
        return;
      }

      const res = await authClient.signUp.email({
        name: data.name!,
        email: data.email,
        password: data.password,
      });

      if (!res || res.error) {
        setMessage(res?.error?.message || "Signup failed");
        return;
      }

      toggleMode();
      reset();
      setMessage("Signup successful. Please login.");
    } catch (err: any) {
      setMessage(err?.message || "Authentication failed");
    }
  }
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 justify-center px-5">
      <View className="bg-white rounded-xl p-6 shadow-md">

        <Text className="text-2xl font-bold text-center">
          {mode === "login" ? "Login" : "Create Account"}
        </Text>

        <Text className="text-center text-gray-500 mb-5">
          {mode === "login"
            ? "Enter your credentials"
            : "Create your account"}
        </Text>

        {mode === "signup" && (
          <>
            <Text className="font-semibold mt-3">Name</Text>

            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 mt-1"
                  placeholder="Your name"
                  value={field.value || ""}
                  onChangeText={field.onChange}
                />
              )}
            />

            {errors.name && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </Text>
            )}
          </>
        )}

        {/* Email */}
        <Text className="font-semibold mt-3">Email</Text>

        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mt-1"
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />

        {errors.email && (
          <Text className="text-red-500 text-xs mt-1">
            {errors.email.message}
          </Text>
        )}

        <Text className="font-semibold mt-3">Password</Text>

        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mt-1"
              placeholder="••••••••"
              secureTextEntry={!showpassword}
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />

        <TouchableOpacity onPress={togglePassword}>
          <Text className="text-black text-xs mt-1">
            {showpassword ? "Hide" : "Show"} Password
          </Text>
        </TouchableOpacity>

        {errors.password && (
          <Text className="text-red-500 text-xs mt-1">
            {errors.password.message}
          </Text>
        )}

        {message && (
          <Text className="text-red-500 text-center mt-2">
            {message}
          </Text>
        )}

        <TouchableOpacity
          className="bg-black py-3 rounded-lg mt-5 items-center"
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold">
              {mode === "login" ? "Login" : "Sign Up"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            toggleMode();
            reset();
            clearMessage();
          }}
        >
          <Text className="mt-4 text-center text-blue-600">
            {mode === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}