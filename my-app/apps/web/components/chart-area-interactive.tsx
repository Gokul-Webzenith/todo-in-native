"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import { useChartStore } from "@repo/store";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";


type Todo = {
  id: number;
  text: string;
  status: string;
  startAt: string;
};

const chartConfig = {
  tasks: {
    label: "Tasks",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({ todos }: { todos: Todo[] }) {
  const isMobile = useIsMobile();

  const { timeRange, setTimeRange } = useChartStore();


  React.useEffect(() => {
    if (isMobile) setTimeRange("7d");
  }, [isMobile, setTimeRange]);

  

  const chartData = React.useMemo(() => {
    const map: Record<string, number> = {};

    todos.forEach((todo) => {
      if (!todo.startAt) return;

      const d = new Date(todo.startAt);

      if (isNaN(d.getTime())) return;

    
      const date = d.toLocaleDateString("en-CA"); // YYYY-MM-DD

      map[date] = (map[date] || 0) + 1;
    });

    return Object.entries(map)
      .map(([date, tasks]) => ({
        date,
        tasks,
      }))
      .sort((a, b) => {
        const da = new Date(a.date + "T00:00:00");
        const db = new Date(b.date + "T00:00:00");
        return da.getTime() - db.getTime();
      });
  }, [todos]);


  const filteredData = React.useMemo(() => {
    if (!chartData.length) return [];

    const today = new Date();

    let days = 90;

    if (timeRange === "30d") days = 30;
    if (timeRange === "7d") days = 7;

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days);

    const data = chartData.filter((item) => {
      const d = new Date(item.date + "T00:00:00");
      return d >= startDate;
    });

    return data.length ? data : chartData;
  }, [chartData, timeRange]);


  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Tasks</CardTitle>

        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Tasks for the selected period
          </span>

          <span className="@[540px]/card:hidden">
            Task history
          </span>
        </CardDescription>

        <CardAction>
          {/* Desktop Toggle */}
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">
              Last 3 months
            </ToggleGroupItem>

            <ToggleGroupItem value="30d">
              Last 30 days
            </ToggleGroupItem>

            <ToggleGroupItem value="7d">
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Mobile Select */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-40 @[767px]/card:hidden"
              size="sm"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="90d">
                Last 3 months
              </SelectItem>

              <SelectItem value="30d">
                Last 30 days
              </SelectItem>

              <SelectItem value="7d">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            {/* Gradient */}
            <defs>
              <linearGradient
                id="fillTasks"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.9}
                />

                <stop
                  offset="95%"
                  stopColor="var(--primary)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="tasks"
              type="monotone"
              fill="url(#fillTasks)"
              stroke="var(--primary)"
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
