"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, MessageSquare, Star, UserPlus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for creators
const mockCreators = [
  {
    id: "1",
    name: "Alex Johnson",
    username: "@alexcreates",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop",
    bio: "Fashion and lifestyle content creator with a focus on sustainable brands.",
    followers: "25.5K",
    engagement: "4.2%",
    categories: ["Fashion", "Lifestyle"],
    location: "New York, USA",
    featured: true,
  },
  {
    id: "2",
    name: "Samantha Lee",
    username: "@samanthalee",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    bio: "Beauty influencer specializing in makeup tutorials and skincare reviews.",
    followers: "102K",
    engagement: "3.8%",
    categories: ["Beauty", "Fashion"],
    location: "Los Angeles, USA",
    featured: false,
  },
  {
    id: "3",
    name: "Marcus Chen",
    username: "@techmarkus",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    bio: "Tech reviewer and gaming enthusiast. Creating in-depth product reviews and tutorials.",
    followers: "78.3K",
    engagement: "5.1%",
    categories: ["Technology", "Gaming"],
    location: "San Francisco, USA",
    featured: true,
  },
  {
    id: "4",
    name: "Priya Patel",
    username: "@priyacreates",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop",
    bio: "Tech and productivity content creator. Sharing tips for digital organization and efficiency.",
    followers: "45.7K",
    engagement: "4.5%",
    categories: ["Technology", "Productivity"],
    location: "Chicago, USA",
    featured: false,
  },
  {
    id: "5",
    name: "James Wilson",
    username: "@fitjames",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=100&auto=format&fit=crop",
    bio: "Fitness trainer and nutrition expert. Sharing workout routines and healthy recipes.",
    followers: "67.2K",
    engagement: "4.8%",
    categories: ["Fitness", "Health"],
    location: "Miami, USA",
    featured: true,
  },
  {
    id: "6",
    name: "Emma Rodriguez",
    username: "@emmacooks",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop",
    bio: "Food blogger and recipe developer. Specializing in easy, family-friendly meals.",
    followers: "89.1K",
    engagement: "4.3%",
    categories: ["Food", "Lifestyle"],
    location: "Austin, USA",
    featured: false,
  },
]

export default function InterestedCreatorsPage() {
  const [creators] = useState(mockCreators)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCreators = creators.filter(
    (creator) =>
      creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.categories.some((category) => category.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Find Creators</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search creators by name, category, or bio..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <span>Category</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Followers</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Engagement Rate</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Location</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline">
          <Star className="h-4 w-4 mr-2" />
          Featured
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCreators.map((creator) => (
          <Card key={creator.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
                  <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{creator.name}</h3>
                      <p className="text-sm text-muted-foreground">{creator.username}</p>
                    </div>
                    {creator.featured && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{creator.bio}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {creator.categories.map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="font-medium">{creator.followers}</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                  <div>
                    <div className="font-medium">{creator.engagement}</div>
                    <div className="text-xs text-muted-foreground">Engagement</div>
                  </div>
                  <div>
                    <div className="font-medium">{creator.location.split(",")[0]}</div>
                    <div className="text-xs text-muted-foreground">Location</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
