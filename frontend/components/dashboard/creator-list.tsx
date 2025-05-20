"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, UserCheck, UserX } from "lucide-react"
import { applicationService } from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"
import { MessageDialog } from "@/components/ui/message-dialog"

interface Application {
  id: string | number;
  creator?: {
    id: string | number;
    name?: string;
    avatar?: string;
    followers?: string;
    engagement?: string;
    interests?: string[];
    categories?: string[];
  };
  campaign?: {
    id?: string | number;
    title?: string;
  };
  createdAt?: string;
  status?: string;
}

interface Creator {
  id: string;
  name: string;
  avatar?: string;
  campaignTitle?: string;
  appliedDate?: string;
  followers?: string;
  engagement?: string;
  categories?: string[];
  status?: string;
}

export function CreatorList({ campaignId }: { campaignId?: string }) {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null)
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchApplications() {
      try {
        setLoading(true)
        // If campaignId is provided, get applications for that campaign only
        const response = await applicationService.getApplications(campaignId ? { campaignId } : undefined)
        
        // Map API response to our Creator interface
        const formattedCreators = response.data.map((app: Application) => ({
          id: app.creator?.id || app.id,
          name: app.creator?.name || "Unknown Creator",
          avatar: app.creator?.avatar || "/placeholder.jpg",
          campaignTitle: app.campaign?.title || "Unknown Campaign",
          appliedDate: app.createdAt || new Date().toISOString(),
          followers: app.creator?.followers || "N/A",
          engagement: app.creator?.engagement || "N/A",
          categories: app.creator?.categories || app.creator?.interests || [],
          status: app.status?.toLowerCase() || "pending"
        }))
        
        setCreators(formattedCreators)
      } catch (error) {
        console.error("Error fetching applications:", error)
        toast({
          title: "Error",
          description: "Failed to load applications. Please try again.",
          variant: "destructive",
        })
        setCreators([])
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [campaignId, toast])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }
  
  const handleStatusUpdate = async (creatorId: string, newStatus: string) => {
    try {
      await applicationService.updateApplicationStatus(creatorId, newStatus)
      
      // Update local state
      setCreators(prev => 
        prev.map(creator => 
          creator.id === creatorId ? { ...creator, status: newStatus.toLowerCase() } : creator
        )
      )
      
      toast({
        title: "Status Updated",
        description: `Application has been ${newStatus.toLowerCase()}.`,
      })
    } catch (error) {
      console.error("Error updating application status:", error)
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  const handleMessage = (creator: Creator) => {
    setSelectedCreator(creator)
    setMessageDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Interested Creators</h2>
      </div>

      {creators.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No creators have applied to your campaigns yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {creators.map((creator) => (
            <Card key={creator.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={creator.avatar || "/placeholder.jpg"} alt={creator.name} />
                      <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{creator.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        Applied to <span className="font-medium">{creator.campaignTitle}</span> on{" "}
                        {formatDate(creator.appliedDate || "")}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {creator.categories && creator.categories.map((category) => (
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
                        <div className="font-medium">{creator.followers || "N/A"}</div>
                        <div className="text-xs text-muted-foreground">Followers</div>
                      </div>
                      <div>
                        <div className="font-medium">{creator.engagement || "N/A"}</div>
                        <div className="text-xs text-muted-foreground">Engagement</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleMessage(creator)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>

                  <div className="flex gap-2">
                    {creator.status === "pending" && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-600"
                          onClick={() => handleStatusUpdate(creator.id, "REJECTED")}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleStatusUpdate(creator.id, "APPROVED")}
                        >
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
      
      {selectedCreator && (
        <MessageDialog
          open={messageDialogOpen}
          onOpenChange={setMessageDialogOpen}
          recipientId={selectedCreator.id}
          recipientName={selectedCreator.name}
        />
      )}
    </div>
  )
}
