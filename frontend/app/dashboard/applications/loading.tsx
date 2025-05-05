import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-48" />
      </div>

      <div className="space-y-4">
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <Skeleton className="w-full md:w-48 h-48 md:h-auto" />
                <CardContent className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <Skeleton className="h-6 w-48 mb-1" />
                      <div className="flex items-center mt-1">
                        <Skeleton className="h-5 w-5 mr-1 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center">
                      <Skeleton className="h-5 w-16 mr-3" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>

                  <Skeleton className="h-24 w-full mb-4" />

                  <div className="flex justify-between">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-9 w-32" />
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
      </div>
    </div>
  )
}
