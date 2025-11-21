import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <DashboardSidebar />
        <SidebarInset>
          <div className="flex flex-col flex-1">
            <DashboardHeader />
            <main className="flex-1 p-6 md:p-8">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

