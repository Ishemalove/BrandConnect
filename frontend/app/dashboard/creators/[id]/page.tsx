"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { userService, profileViewService } from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Instagram, Twitter, Youtube, Globe, Mail, MessageSquare } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageDialog } from "@/components/ui/message-dialog"

export default function CreatorProfilePage() {
  const params = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const [creator, setCreator] = useState(null)
  const [loading, setLoading] = useState(true)
  const creatorId = params.id
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        setLoading(true)
        
        // Track profile view - only if user is a brand
        if (user?.role === "BRAND" && creatorId) {
          try {
            console.log("Tracking profile view for creator ID:", creatorId)
            const response = await profileViewService.trackProfileView(String(creatorId))
            if (response.data?.error) {
              console.log("Profile view tracking handled gracefully:", response.data.message)
            } else {
              console.log("Profile view tracking successful:", response.data)
            }
          } catch (error) {
            // Don't let profile view tracking errors block the main functionality
            console.error("Error tracking profile view, continuing anyway:", error)
          }
        }
        
        // Fetch creator profile
        const response = await userService.getCreatorProfile(String(creatorId))
        console.log("Creator profile data:", response.data)
        
        if (response.data) {
          setCreator(response.data)
        } else {
          toast({
            title: "Warning",
            description: "Creator profile data may be incomplete",
            variant: "default",
          })
        }
      } catch (error) {
        console.error("Error fetching creator profile:", error)
        toast({
          title: "Error",
          description: "Failed to load creator profile",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (creatorId) {
      fetchCreator()
    }
  }, [creatorId, user?.role, toast])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full md:col-span-2" />
        </div>
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="p-6 flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-xl font-medium mb-2">Creator Not Found</h3>
        <p className="text-muted-foreground max-w-md">
          We couldn't find the creator you're looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Creator Profile</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </Button>
          <Button 
            size="sm"
            onClick={() => setMessageDialogOpen(true)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src={creator.avatarUrl || "/placeholder.svg?height=128&width=128"} alt={creator.fullName} />
              <AvatarFallback>{creator.fullName?.charAt(0) || "C"}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{creator.fullName}</h2>
            <p className="text-muted-foreground">@{creator.username || creator.fullName?.toLowerCase().replace(/\s/g, '')}</p>
            
            <div className="flex flex-wrap gap-1 my-3 justify-center">
              {creator.categories?.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
            
            <div className="w-full mt-6 space-y-2 text-center">
              <div className="flex items-center justify-center">
                <Instagram className="h-4 w-4 mr-2 text-muted-foreground" />
                <a
                  href={`https://instagram.com/${creator.instagramHandle || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                >
                  {creator.instagramHandle || "Instagram"}
                </a>
              </div>
              <div className="flex items-center justify-center">
                <Twitter className="h-4 w-4 mr-2 text-muted-foreground" />
                <a
                  href={`https://twitter.com/${creator.twitterHandle || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                >
                  {creator.twitterHandle || "Twitter"}
                </a>
              </div>
              <div className="flex items-center justify-center">
                <Youtube className="h-4 w-4 mr-2 text-muted-foreground" />
                <a
                  href={creator.youtubeChannel || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                >
                  YouTube
                </a>
              </div>
              <div className="flex items-center justify-center">
                <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                <a
                  href={creator.website || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                >
                  {creator.website || "Website"}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="about" className="space-y-4">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About {creator.fullName}</CardTitle>
                  <CardDescription>Creator bio and information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Bio</h3>
                    <p className="text-sm">{creator.bio || "No bio provided."}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Location</h3>
                    <p className="text-sm">{creator.location || "Not specified"}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Content Categories</h3>
                    <div className="flex flex-wrap gap-1">
                      {creator.categories?.map((category) => (
                        <Badge key={category} variant="outline">
                          {category}
                        </Badge>
                      )) || "No categories specified"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio</CardTitle>
                  <CardDescription>Recent work and content samples</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Placeholder portfolio items */}
                    <div className="aspect-video rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                      Portfolio preview
                    </div>
                    <div className="aspect-video rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                      Portfolio preview
                    </div>
                    <div className="aspect-video rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                      Portfolio preview
                    </div>
                    <div className="aspect-video rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                      Portfolio preview
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Creator Statistics</CardTitle>
                  <CardDescription>Performance metrics and audience information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Followers</p>
                      <p className="text-2xl font-bold">45.3K</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Engagement</p>
                      <p className="text-2xl font-bold">4.7%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Campaigns</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Content Type</p>
                      <p className="text-2xl font-bold">Video</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <MessageDialog
        open={messageDialogOpen}
        onOpenChange={setMessageDialogOpen}
        recipientId={String(creatorId)}
        recipientName={creator?.fullName || "Creator"}
      />
    </div>
  )
} 