"use client"
import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { useSmartAccount } from "@/hooks/use-smart-account"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Spinner } from "@/components/ui/spinner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { loading, config } = useSmartAccount()
  const router = useRouter()
  useEffect(() => {
    if (!loading && !config) {
      router.push("/signin")
    }
  }, [loading, config, router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <Spinner className="size-8 text-primary" />
    </div>
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>
        <SidebarInset>
          <div className="flex flex-col flex-1 pb-16 md:pb-0">
            <DashboardHeader />
            <main className="flex-1 p-6 md:p-8">{children}</main>
          </div>
        </SidebarInset>
        <MobileNav />
      </div>
    </SidebarProvider>
  )
}

