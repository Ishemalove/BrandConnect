import { Button } from "@/components/ui/button"
import Link from "next/link"

export function LandingCTA() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Marketing Collaborations?</h2>
        <p className="text-xl max-w-2xl mx-auto mb-10 text-primary-foreground/90">
          Join thousands of brands and creators already connecting on our platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
