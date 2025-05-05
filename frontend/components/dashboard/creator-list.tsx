"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, UserCheck, UserX } from "lucide-react"

// Mock data for interested creators
const mockCreators = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop",
    campaignTitle: "Summer Fashion Collection",
    appliedDate: "2023-04-15",
    followers: "25.5K",
    engagement: "4.2%",
    categories: ["Fashion", "Lifestyle"],
    status: "pending",
  },
  {
    id: "2",
    name: "Samantha Lee",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    campaignTitle: "Summer Fashion Collection",
    appliedDate: "2023-04-14",
    followers: "102K",
    engagement: "3.8%",
    categories: ["Fashion", "Beauty"],
    status: "pending",
  },
  {
    id: "3",
    name: "Marcus Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    campaignTitle: "Tech Gadget Review",
    appliedDate: "2023-04-12",
    followers: "78.3K",
    engagement: "5.1%",
    categories: ["Technology", "Gaming"],
    status: "approved",
  },
  {
    id: "4",
    name: "Priya Patel",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop",
    campaignTitle: "Tech Gadget Review",
    appliedDate: "2023-04-11",
    followers: "45.7K",
    engagement: "4.5%",
    categories: ["Technology", "Productivity"],
    status: "rejected",
  },
]

export function CreatorList() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Interested Creators</h2>
      </div>

      {mockCreators.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No creators have applied to your campaigns yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {mockCreators.map((creator) => (
            <Card key={creator.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
                      <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{creator.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        Applied to <span className="font-medium">{creator.campaignTitle}</span> on{" "}
                        {formatDate(creator.appliedDate)}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {creator.categories.map((category) => (
                          <Badge key={category} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:text-right">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div>
                        <div className="font-medium">{creator.followers}</div>
                        <div className="text-xs text-muted-foreground">Followers</div>
                      </div>
                      <div>
                        <div className="font-medium">{creator.engagement}</div>
                        <div className="text-xs text-muted-foreground">Engagement</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>

                  <div className="flex gap-2">
                    {creator.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-600">
                          <UserX className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button size="sm">
                          <UserCheck className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </>
                    )}
                    {creator.status === "approved" && (
                      <Button size="sm" variant="outline" disabled>
                        Approved
                      </Button>
                    )}
                    {creator.status === "rejected" && (
                      <Button size="sm" variant="outline" disabled>
                        Rejected
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
