import React, { useEffect, useMemo, useState } from "react";

import {
  View,
  Text,
  Dimensions,
  Pressable,
} from "react-native";

import { LineChart } from "react-native-chart-kit";


type Todo = {
  id: number;
  text: string;
  status: string;
  startAt: string;
};

const screenWidth = Dimensions.get("window").width;


export default function ChartAreaInteractiveMobile({
  todos,
}: {
  todos: Todo[];
}) {
  const [timeRange, setTimeRange] = useState<
    "7d" | "30d" | "90d"
  >("7d");


  useEffect(() => {
    setTimeRange("7d");
  }, []);

  const chartData = useMemo(() => {
    const map: Record<string, number> = {};

    todos.forEach((todo) => {
      if (!todo.startAt) return;

      const d = new Date(todo.startAt);

      if (isNaN(d.getTime())) return;

      const date = d.toISOString().split("T")[0];

      map[date] = (map[date] || 0) + 1;
    });

    return Object.entries(map)
      .map(([date, tasks]) => ({
        date,
        tasks,
      }))
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      );
  }, [todos]);


  const filteredData = useMemo(() => {
    if (!chartData.length) return [];

    const today = new Date();

    let days = 90;

    if (timeRange === "30d") days = 30;
    if (timeRange === "7d") days = 7;

    const start = new Date();
    start.setDate(today.getDate() - days);

    return chartData.filter(
      (item) => new Date(item.date) >= start
    );
  }, [chartData, timeRange]);


  const labels = filteredData.map((item) =>
    new Date(item.date).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    })
  );

  const values = filteredData.map(
    (item) => item.tasks
  );

  return (
    <View className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">
      {/* Header */}
      <View className="mb-3">
        <Text className="text-lg font-semibold">
          Total Tasks
        </Text>

        <Text className="text-sm text-gray-500 mt-1">
          Tasks for the selected period
        </Text>
      </View>

      {/* Toggle */}
      <View className="flex-row mb-4">
        <RangeBtn
          label="7D"
          active={timeRange === "7d"}
          onPress={() => setTimeRange("7d")}
        />

        <RangeBtn
          label="30D"
          active={timeRange === "30d"}
          onPress={() => setTimeRange("30d")}
        />

        <RangeBtn
          label="90D"
          active={timeRange === "90d"}
          onPress={() => setTimeRange("90d")}
        />
      </View>

      {/* Chart */}
      {values.length > 0 ? (
        <LineChart
          data={{
            labels,
            datasets: [{ data: values }],
          }}
          width={screenWidth - 48}
          height={240}
          bezier
          withDots
          withShadow
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",

            decimalPlaces: 0,

            color: (o = 1) =>
              `rgba(79,70,229,${o})`,

            labelColor: (o = 1) =>
              `rgba(0,0,0,${o})`,

            fillShadowGradient: "#4f46e5",
            fillShadowGradientOpacity: 0.25,

            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#4f46e5",
            },
          }}
          style={{
            borderRadius: 12,
          }}
        />
      ) : (
        <Text className="text-center text-gray-400 py-10">
          No data available
        </Text>
      )}
    </View>
  );
}
function RangeBtn({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-3 py-1.5 mr-2 rounded-md border ${
        active
          ? "bg-indigo-600 border-indigo-600"
          : "bg-white border-gray-300"
      }`}
    >
      <Text
        className={`text-xs font-medium ${
          active ? "text-white" : "text-gray-700"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}