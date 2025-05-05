"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, MessageSquare, CheckCircle, XCircle } from "lucide-react"
import { applicationService, profileViewService } from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function InterestedCreatorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Fetch applications from backend
  useEffect(() => {
    async function fetchApplications() {
      try {
        setLoading(true)
        const response = await applicationService.getApplications()
        console.log("Applications data:", response.data)
        setApplications(response.data || [])
      } catch (error) {
        console.error("Error fetching applications:", error)
        toast({
          title: "Error",
          description: "Failed to load applications. Please try again.",
          variant: "destructive",
        })
        setApplications([])
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [toast])

  // Function to handle application status updates
  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await applicationService.updateApplicationStatus(applicationId.toString(), newStatus)
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
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

  // Filter applications by search query
  const filteredApplications = applications.filter(app => {
    const creator = app.creator || {}
    const searchText = searchQuery.toLowerCase()
    
    return (
      creator.name?.toLowerCase().includes(searchText) ||
      creator.username?.toLowerCase().includes(searchText) ||
      (creator.interests && creator.interests.some(interest => 
        interest.toLowerCase().includes(searchText)
      )) ||
      app.campaign?.title?.toLowerCase().includes(searchText)
    )
  })

  // Group applications by status
  const newApplications = filteredApplications.filter(app => 
    app.status === "PENDING" || app.status === "New" || app.status === "NEW"
  )
  
  const contactedApplications = filteredApplications.filter(app => 
    app.status === "APPROVED" || app.status === "Contacted" || app.status === "CONTACTED"
  )
  
  const shortlistedApplications = filteredApplications.filter(app => 
    app.status === "SHORTLISTED" || app.status === "Shortlisted"
  )

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="flex gap-2">
            <div className="h-10 w-[250px] bg-gray-200 animate-pulse rounded"></div>
            <div className="h-10 w-10 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>

        <div className="h-10 w-full max-w-md bg-gray-200 animate-pulse rounded mb-6"></div>

        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex items-start space-x-4 flex-1">
                  <div className="h-12 w-12 bg-gray-200 animate-pulse rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded mt-2"></div>
                  </div>
                </div>
                <div className="p-6 border-t md:border-t-0 md:border-l border-border flex flex-col justify-between bg-muted/30 w-full md:w-64">
                  <div className="space-y-2 mb-4">
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-9 w-full bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Interested Creators</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search creators..."
              className="w-[250px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Creators</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="contacted">Contacted</TabsTrigger>
          <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Filter className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No Applications Found</h3>
              <p className="text-muted-foreground max-w-md">
                No applications are available at this time. Check back later or try a different search.
              </p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <ApplicationCard 
                key={application.id} 
                application={application}
                onStatusUpdate={handleStatusUpdate}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          {newApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Filter className="h-10 w-10 text-muted-foreground" />
                      </div>
              <h3 className="text-xl font-medium mb-2">No New Applications</h3>
              <p className="text-muted-foreground max-w-md">
                You don't have any new applications at this time.
              </p>
                      </div>
          ) : (
            newApplications.map((application) => (
              <ApplicationCard 
                key={application.id} 
                application={application}
                onStatusUpdate={handleStatusUpdate}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="contacted" className="space-y-4">
          {contactedApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Filter className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No Contacted Creators</h3>
              <p className="text-muted-foreground max-w-md">
                You haven't contacted any creators yet.
              </p>
            </div>
          ) : (
            contactedApplications.map((application) => (
              <ApplicationCard 
                key={application.id} 
                application={application}
                onStatusUpdate={handleStatusUpdate}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="shortlisted" className="space-y-4">
          {shortlistedApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Filter className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No Shortlisted Creators</h3>
              <p className="text-muted-foreground max-w-md">
                You haven't shortlisted any creators yet. Browse through interested creators and shortlist them for your
                campaigns.
              </p>
            </div>
          ) : (
            shortlistedApplications.map((application) => (
              <ApplicationCard 
                key={application.id} 
                application={application}
                onStatusUpdate={handleStatusUpdate}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Application Card component to display each application
function ApplicationCard({ application, onStatusUpdate }) {
  const router = useRouter()
  const { toast } = useToast()
  // Extract creator and campaign data from application
  const creator = application.creator || {}
  const campaign = application.campaign || {}
  
  // Handle cases where the API response might have different structures
  const name = creator.name || application.name || "Unknown Creator"
  const username = creator.username || application.username || "@username"
  const avatar = creator.avatar || application.avatar || "/placeholder.svg"
  const followers = creator.followers || application.followers || "N/A"
  const engagement = creator.engagement || application.engagement || "N/A"
  const campaignTitle = campaign.title || application.campaign || "Unknown Campaign"
  
  // Normalize status value
  const status = (application.status || "").toUpperCase()
  const interests = creator.interests || application.interests || []
  
  // Function to handle viewing creator profile
  const handleViewProfile = async () => {
    try {
      // Always navigate to the profile page even if tracking fails
      let navigateToProfile = true;
      
      // Track the profile view - ensure creator.id is properly converted to string
      if (creator.id) {
        try {
          // Log for debugging
          console.log("Tracking profile view for creator ID:", creator.id);
          const trackingResponse = await profileViewService.trackProfileView(creator.id.toString(), application.id.toString());
          
          if (trackingResponse.data?.error) {
            console.log("Profile view tracking handled gracefully:", trackingResponse.data.message);
          } else {
            console.log("Profile view tracking successful");
          }
        } catch (trackingError) {
          // Don't stop navigation if tracking fails
          console.error("Error tracking profile view:", trackingError);
        }
      } else {
        console.warn("No creator ID found, proceeding without tracking");
      }
      
      // Navigate to creator profile page regardless of tracking success
      if (navigateToProfile && creator.id) {
        router.push(`/dashboard/creators/${creator.id}`);
      } else if (!creator.id) {
        toast({
          title: "Error",
          description: "Cannot view profile. Creator ID is missing.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error navigating to profile:", error);
      toast({
        title: "Error",
        description: "Failed to navigate to creator profile",
        variant: "destructive",
      });
    }
  }
  
  // Style for the status badge
  const getBadgeStyle = (status) => {
    if (status === "PENDING" || status === "NEW") {
      return "bg-green-100 text-green-800 hover:bg-green-100"
    } else if (status === "APPROVED" || status === "CONTACTED") {
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    } else if (status === "SHORTLISTED") {
      return "bg-purple-100 text-purple-800 hover:bg-purple-100"
    } else if (status === "REJECTED") {
      return "bg-red-100 text-red-800 hover:bg-red-100"
    }
    return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
  
  // Format status for display
  const formatStatus = (status) => {
    if (status === "PENDING") return "New"
    if (status === "NEW") return "New"
    if (status === "APPROVED") return "Contacted"
    if (status === "CONTACTED") return "Contacted"
    if (status === "SHORTLISTED") return "Shortlisted"
    if (status === "REJECTED") return "Rejected"
    return status ? status.charAt(0) + status.slice(1).toLowerCase() : "Unknown"
  }
  
  return (
    <Card key={application.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 flex items-start space-x-4 flex-1">
                    <Avatar className="h-12 w-12">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <div>
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm text-muted-foreground">{username}</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
              {interests.map((interest) => (
                          <Badge key={interest} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t md:border-t-0 md:border-l border-border flex flex-col justify-between bg-muted/30 w-full md:w-64">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Followers:</span>
              <span className="text-sm font-medium">{followers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Engagement:</span>
              <span className="text-sm font-medium">{engagement}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Campaign:</span>
              <span className="text-sm font-medium truncate max-w-[120px]">{campaignTitle}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
            <Badge className={`self-start ${getBadgeStyle(status)}`}>
              {formatStatus(status)}
            </Badge>
            
            {(status === "PENDING" || status === "NEW") && (
              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  size="sm"
                  onClick={() => onStatusUpdate(application.id, "APPROVED")}
                >
                  <CheckCircle className="h-4 w-4 mr-1" /> Accept
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={() => onStatusUpdate(application.id, "REJECTED")}
                >
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
              </div>
            )}
            
            {(status !== "PENDING" && status !== "NEW") && (
                      <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  size="sm"
                  onClick={handleViewProfile}
                >
                          View Profile
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
            )}
                    </div>
                  </div>
                </div>
              </Card>
  )
}
