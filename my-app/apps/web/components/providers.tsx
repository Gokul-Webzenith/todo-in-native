"use client";

import * as React from "react";

import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create client only once
  const [queryClient] = React.useState(
    () => new QueryClient()
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
