"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";

import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";

import { todoApi } from "../../lib/api-client";

/* ================= TYPES ================= */

type Todo = {
  id: number;
  text: string;
  description: string;
  status: "todo" | "backlog" | "inprogress" | "done" | "cancelled";
  startAt: string;
  endAt: string;
};

export default function Page() {
  const router = useRouter();


const {
  data: todos = [],
  isLoading,
  error,
} = todoApi.useQuery("get", "/api");

  /* ================= LOADING ================= */

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        Loading dashboard...
      </div>
    );
  }

  /* ================= ERROR ================= */

if (error) {
  const err = error as Error;

  return (
    <div className="p-6 text-red-600">
      {err.message || "Failed to load dashboard"}
    </div>
  );
}

  /* ================= TABLE DATA ================= */

  const tableData = todos.map((t) => ({
    id: t.id,

    header: t.text,
    description: t.description,

    type: "Task",
    status: t.status,

    target: new Date(t.startAt).toLocaleDateString(),
    limit: new Date(t.endAt).toLocaleDateString(),
  }));

  /* ================= UI ================= */

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SidebarInset>
        {/* Header */}
        <SiteHeader />

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

              {/* Cards */}
              <SectionCards todos={todos} />

              {/* Chart */}
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive todos={todos} />
              </div>

              {/* Table */}
              <DataTable data={tableData} />

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}