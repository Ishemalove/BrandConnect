"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, Eye, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

// Mock data for campaigns
const mockCampaigns = [
  {
    id: "1",
    title: "Summer Fashion Collection",
    description: "Looking for fashion creators to showcase our new summer collection.",
    status: "active",
    category: "Fashion",
    startDate: "2023-05-01",
    endDate: "2023-06-01",
    applications: 12,
    views: 245,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Tech Gadget Review",
    description: "Seeking tech reviewers to create honest reviews of our latest smartphone.",
    status: "active",
    category: "Technology",
    startDate: "2023-05-15",
    endDate: "2023-06-15",
    applications: 8,
    views: 189,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Fitness Challenge",
    description: "Looking for fitness influencers to participate in and promote our 30-day fitness challenge.",
    status: "draft",
    category: "Fitness",
    startDate: "",
    endDate: "",
    applications: 0,
    views: 0,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Spring Makeup Collection",
    description: "Seeking beauty creators to showcase our spring makeup collection.",
    status: "completed",
    category: "Beauty",
    startDate: "2023-03-01",
    endDate: "2023-04-01",
    applications: 24,
    views: 412,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop",
  },
]

export function CampaignList() {
  const [campaigns, setCampaigns] = useState(mockCampaigns)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Draft
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const handleDelete = (id: string) => {
    setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Campaigns</h2>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">You haven't created any campaigns yet.</p>
          <Button className="mt-4">Create Campaign</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-48 h-48 md:h-auto">
                  <ImageWithFallback
                    src={campaign.image || "/placeholder.svg"}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                    fallbackSrc="/placeholder.svg"
                  />
                </div>
                <CardContent className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{campaign.title}</h3>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {campaign.status !== "draft"
                          ? `${formatDate(campaign.startDate)} - ${formatDate(campaign.endDate)}`
                          : "Draft - Not published yet"}
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(campaign.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">{campaign.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        {campaign.category}
                      </Badge>
                    </div>
                    {campaign.status !== "draft" && (
                      <>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{campaign.applications} applications</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{campaign.views} views</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
