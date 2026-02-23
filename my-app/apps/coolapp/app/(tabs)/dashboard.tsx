import React from "react";

import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { todoApi } from "../../lib/api-client";

import ChartAreaInteractive from "./../../components/chart-area-interactive";

type Todo = {
  id: number;
  text: string;
  description: string;
  status: "todo" | "backlog" | "inprogress" | "done" | "cancelled";
  startAt: string;
  endAt: string;
};

/* ================= PAGE ================= */

export default function Dashboard() {
  /* ================= FETCH TODOS ================= */

 const {
  data,
  isLoading,
  error,
} = todoApi.useQuery("get", "/api");

const todos: Todo[] = data ?? [];
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-gray-600">
          Loading dashboard...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-red-500 text-center">
          Failed to load dashboard
        </Text>
      </View>
    );
  }


  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text className="text-2xl font-bold px-4 pt-3 mb-4">
              Dashboard
            </Text>

            <View className="px-4 mb-4">
              <ChartAreaInteractive todos={todos} />
            </View>

            <Text className="text-lg font-semibold px-4 mb-2">
              Tasks
            </Text>
          </>
        }

        renderItem={({ item }) => (
          <View className="bg-gray-100 rounded-xl p-4 mb-3 mx-4">
            <Text className="font-semibold text-base">
              {item.text}
            </Text>

            <Text className="text-gray-600 text-sm mt-1">
              {item.description}
            </Text>

            <Text className="text-indigo-600 text-xs mt-2 font-medium">
              {item.status.toUpperCase()}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}