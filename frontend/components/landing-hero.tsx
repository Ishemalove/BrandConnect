import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function LandingHero() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Connect Brands with Creators for Amazing Campaigns
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            BrandConnect is where brands find the perfect creators and creators discover exciting marketing
            opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?type=brand">
              <Button size="lg" className="w-full sm:w-auto">
                I'm a Brand
              </Button>
            </Link>
            <Link href="/signup?type=creator">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                I'm a Creator
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-16 relative">
          <div className="aspect-[16/9] max-w-5xl mx-auto rounded-lg overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1920&auto=format&fit=crop"
              alt="BrandConnect Platform"
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
