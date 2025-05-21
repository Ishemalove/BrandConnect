"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { BrandConnectLogo } from "./brand-connect-logo"
import ContactModal from "@/app/contact/page"

export function LandingNavbar() {
  const pathname = usePathname()

  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <BrandConnectLogo className="h-8 w-8" />
            <span className="font-bold text-xl">BrandConnect</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/explore" className="text-sm font-medium hover:text-primary transition-colors">
              Explore
            </Link>
            <Link href="/for-brands" className="text-sm font-medium hover:text-primary transition-colors">
              For Brands
            </Link>
            <Link href="/for-creators" className="text-sm font-medium hover:text-primary transition-colors">
              For Creators
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ContactModal />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Sign up</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
