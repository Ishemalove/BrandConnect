"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, MessageSquare } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data for creator campaigns
const mockCampaigns = [
  {
    id: "1",
    title: "Summer Fashion Collection",
    brand: "StyleCo",
    brandLogo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=40&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    category: "Fashion",
    status: "active",
    compensation: "$500",
    deadline: "2023-06-15",
    description: "Creating Instagram posts featuring our summer collection.",
  },
  {
    id: "2",
    title: "Healthy Meal Prep",
    brand: "NutriLife",
    brandLogo: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=40&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop",
    category: "Food",
    status: "completed",
    compensation: "$350",
    deadline: "2023-05-20",
    description: "Created 3 recipe videos featuring NutriLife products.",
  },
  {
    id: "3",
    title: "Tech Gadget Review",
    brand: "TechWorld",
    brandLogo: "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?q=80&w=40&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    category: "Technology",
    status: "pending",
    compensation: "$600",
    deadline: "2023-07-01",
    description: "Comprehensive review of the new smartphone model.",
  },
]

export default function CreatorCampaignsPage() {
  const [campaigns] = useState(mockCampaigns)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">My Campaigns</h1>
        <Link href="/dashboard/explore">
          <Button>Find New Campaigns</Button>
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">You haven't joined any campaigns yet.</p>
          <Button className="mt-4">Explore Available Campaigns</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden flex flex-col">
              <div className="relative w-full h-48">
                <Image src={campaign.image || "/placeholder.svg"} alt={campaign.title} fill className="object-cover" />
                <div className="absolute top-2 right-2">{getStatusBadge(campaign.status)}</div>
              </div>
              <CardContent className="pt-6 flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={campaign.brandLogo || "/placeholder.svg"} alt={campaign.brand} />
                    <AvatarFallback>{campaign.brand[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{campaign.brand}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{campaign.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{campaign.description}</p>
                <div className="flex justify-between text-sm mb-3">
                  <span className="font-medium">{campaign.compensation}</span>
                  <span className="text-muted-foreground">Deadline: {campaign.deadline}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {campaign.category}
                </Badge>
              </CardContent>
              <CardFooter className="pt-0 pb-4 flex justify-between">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Brand
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
