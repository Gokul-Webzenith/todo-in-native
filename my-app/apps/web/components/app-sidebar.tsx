'use client'

import Link from "next/link"
import { useAuthStore } from "@repo/store"

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@workspace/ui/components/sidebar"

import { Home, Briefcase, BarChart, Shield } from "lucide-react"

export default function AppSidebar() {
  const { user } = useAuthStore()

  return (
    <SidebarContent className="w-full p-2">

      <SidebarGroup>
        <SidebarGroupLabel className="text-xs">
          Menu
        </SidebarGroupLabel>

        <SidebarMenu>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/work">
                <Briefcase className="mr-2 h-4 w-4" />
                Work
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <BarChart className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* ✅ ADMIN LINK */}
          {user?.role === "admin" && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

        </SidebarMenu>
      </SidebarGroup>

    </SidebarContent>
  )
}
