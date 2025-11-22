"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Send, ArrowRightLeft, TrendingUp, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()

  const items = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Overview",
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/send",
      icon: Send,
      label: "Send",
      active: pathname === "/dashboard/send",
    },
    {
      href: "/dashboard/swap",
      icon: ArrowRightLeft,
      label: "Swap",
      active: pathname === "/dashboard/swap",
    },
    {
      href: "/dashboard/earn",
      icon: TrendingUp,
      label: "Earn",
      active: pathname === "/dashboard/earn",
    },
    {
      href: "/dashboard/settings",
      icon: Settings,
      label: "Settings",
      active: pathname === "/dashboard/settings",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/80 backdrop-blur-lg md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-lg p-2 text-xs font-medium transition-colors",
              item.active
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <item.icon className="size-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
