"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Home,
  MessageSquare,
  Search,
  Settings,
  Briefcase,
  Users,
  BookmarkIcon,
  FileText,
  PlusCircle,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"

export function DashboardSidebar() {
  const { user } = useAuth()
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const NavItem = ({ 
    href, 
    icon: Icon, 
    children 
  }: { 
    href: string; 
    icon?: React.ElementType; 
    children: React.ReactNode 
  }) => (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        isActive(href) ? "bg-accent text-accent-foreground" : "text-muted-foreground"
      )}
    >
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      <span>{children}</span>
    </Link>
  )

  const NavGroup = ({ 
    title, 
    children 
  }: { 
    title: string; 
    children: React.ReactNode 
  }) => (
    <div className="py-2">
      <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-tight text-muted-foreground">
        {title}
      </h2>
      <div className="space-y-1">{children}</div>
    </div>
  )

  return (
    <div className="flex h-full flex-col overflow-y-auto py-4">


      <div className="flex-1 px-3">
        <NavGroup title="Navigation">
          <NavItem href="/dashboard" icon={Home}>Home</NavItem>
          <NavItem href="/dashboard/explore" icon={Search}>Explore</NavItem>
          <NavItem href="/dashboard/messages" icon={MessageSquare}>Messages</NavItem>
        </NavGroup>

        <div className="my-2 h-px bg-border" />

        {user?.role === "BRAND" ? (
          <NavGroup title="Brand">
            <NavItem href="/dashboard/campaigns" icon={Briefcase}>My Campaigns</NavItem>
            <NavItem href="/dashboard/interested" icon={Users}>Interested Creators</NavItem>
            <NavItem href="/dashboard/analytics" icon={BarChart3}>Analytics</NavItem>
          </NavGroup>
        ) : (
          <NavGroup title="Creator">
            <NavItem href="/dashboard/saved" icon={BookmarkIcon}>Saved Campaigns</NavItem>
            <NavItem href="/dashboard/applications" icon={FileText}>My Applications</NavItem>
            <NavItem href="/dashboard/performance" icon={BarChart3}>Performance</NavItem>
          </NavGroup>
        )}

        {user?.role === "CREATOR" && (
          <>
            <div className="my-2 h-px bg-border" />
            <NavGroup title="Interests">
              <NavItem href="/dashboard/explore?category=fashion">Fashion</NavItem>
              <NavItem href="/dashboard/explore?category=technology">Technology</NavItem>
              <NavItem href="/dashboard/explore?category=beauty">Beauty</NavItem>
            </NavGroup>
          </>
        )}
      </div>

      <div className="mt-auto px-3 py-2">
        <NavItem href="/dashboard/settings" icon={Settings}>Settings</NavItem>
      </div>
    </div>
  )
}
