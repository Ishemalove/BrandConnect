"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { redirect } from "next/navigation"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Expose the toggle function to the window for the navbar to use
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
      };
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/login")
    }
  }, [user, isLoading])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return <div className="p-8 text-center">Please log in to view your dashboard.</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNavbar openMobileMenu={() => setIsMobileMenuOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar with overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-200 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        <aside 
          className={`fixed left-0 top-[60px] bottom-0 w-64 md:w-64 border-r bg-background z-50 md:relative md:top-0 transition-transform duration-300 md:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <DashboardSidebar />
        </aside>
        
        <main className="flex-1 overflow-auto p-6 md:ml-0 w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
