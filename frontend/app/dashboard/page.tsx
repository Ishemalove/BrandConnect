"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      // Ensure roles are properly used with correct casing
      if (user.role !== "BRAND" && user.role !== "CREATOR") {
        console.error("Invalid user role:", user.role)
      }
    }
  }, [user, isLoading])

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (!user) {
    return <div className="p-8 text-center">Please log in to view your dashboard.</div>
  }

  return <DashboardOverview />
}
