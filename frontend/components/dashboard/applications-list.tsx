"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, ExternalLink, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { applicationService } from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

interface Application {
  id: number;
  status: string;
  appliedAt: string;
  campaign_id?: number; // Fallback for direct database mapping
  creator_id?: number; // Fallback for direct database mapping
  campaign?: {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    brand?: {
      id: number;
      name: string;
      logo?: string;
    }
  };
  creator?: {
    id: number;
    name: string;
    email: string;
  };
  message?: string;
}

interface ApplicationsListProps {
  initialApplications?: Application[];
}

export function ApplicationsList({ initialApplications }: ApplicationsListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [applications, setApplications] = useState<Application[]>(initialApplications || [])
  const [loading, setLoading] = useState(!initialApplications)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [apiError, setApiError] = useState<string | null>(null)
  
  // Get campaign ID from URL if available
  const campaignId = searchParams?.get('campaign')

  useEffect(() => {
    // Skip API calls if we have initialApplications
    if (initialApplications) {
      console.log("Using provided initial applications data:", initialApplications)
      return
    }
    
    const fetchApplications = async () => {
      try {
        setLoading(true)
        setApiError(null)
        
        console.log("Fetching applications from unified endpoint")
        
        // Use the single unified endpoint
        const params = campaignId ? { campaignId } : {}
        const response = await applicationService.getApplications(params)
        
        if (response && response.data) {
          if (Array.isArray(response.data)) {
            console.log(`Found ${response.data.length} applications`)
            setApplications(response.data)
          } else {
            console.warn("Response data is not an array:", response.data)
            setApiError("Invalid response format from server")
            setApplications([])
          }
        } else {
          console.warn("No data in response")
          setApplications([])
          setApiError("No applications data received from server")
        }
      } catch (error) {
        console.error("Error fetching applications:", error)
        setApiError("Failed to fetch applications")
        toast({
          title: "Error",
          description: "Failed to load your applications. Please try again later.",
          variant: "destructive",
        })
        setApplications([])
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [toast, campaignId])

  const getStatusBadge = (status: string) => {
    // Normalize status to lowercase for comparison
    const normalizedStatus = status.toLowerCase()
    
    switch (normalizedStatus) {
      case "pending":
      case "new":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "accepted":
      case "approved":
      case "contacted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Accepted
          </Badge>
        )
      case "rejected":
      case "declined":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      case "shortlisted":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Shortlisted
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  // Filter applications by status
  const getFilteredApplications = () => {
    let filtered = [...applications]
    
    // Apply search filter if any
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(app => 
        app.campaign?.title?.toLowerCase().includes(query) ||
        app.campaign?.brand?.name?.toLowerCase().includes(query) ||
        app.status?.toLowerCase().includes(query)
      )
    }
    
    // Apply status filter
    if (activeTab !== "all") {
      switch (activeTab) {
        case "pending":
          filtered = filtered.filter(app => 
            app.status?.toLowerCase() === "pending" || 
            app.status?.toLowerCase() === "new"
          )
          break
        case "accepted":
          filtered = filtered.filter(app => 
            app.status?.toLowerCase() === "accepted" || 
            app.status?.toLowerCase() === "approved" || 
            app.status?.toLowerCase() === "contacted"
          )
          break
        case "rejected":
          filtered = filtered.filter(app => 
            app.status?.toLowerCase() === "rejected" || 
            app.status?.toLowerCase() === "declined"
          )
          break
        case "shortlisted":
          filtered = filtered.filter(app => 
            app.status?.toLowerCase() === "shortlisted"
          )
          break
      }
    }
    
    return filtered
  }
  
  const filteredApplications = getFilteredApplications()
  
  // Count applications by status for the tab counts
  const counts = {
    all: applications.length,
    pending: applications.filter(app => 
      app.status?.toLowerCase() === "pending" || 
      app.status?.toLowerCase() === "new"
    ).length,
    accepted: applications.filter(app => 
      app.status?.toLowerCase() === "accepted" || 
      app.status?.toLowerCase() === "approved" || 
      app.status?.toLowerCase() === "contacted"
    ).length,
    rejected: applications.filter(app => 
      app.status?.toLowerCase() === "rejected" || 
      app.status?.toLowerCase() === "declined"
    ).length,
    shortlisted: applications.filter(app => 
      app.status?.toLowerCase() === "shortlisted"
    ).length
  }

  if (loading) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Applications</h2>
      </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden mb-4">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-48 h-48 md:h-auto bg-muted animate-pulse" />
              <CardContent className="flex-1 p-6">
                <div className="h-6 w-1/2 bg-muted rounded animate-pulse mb-4" />
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse mb-6" />
                <div className="h-20 bg-muted rounded animate-pulse mb-4" />
                <div className="flex justify-between">
                  <div className="h-8 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-32 bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">
          {campaignId ? "Campaign Applications" : "My Applications"}
        </h2>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search applications..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Debug section - only shown in development */}
      {process.env.NODE_ENV === 'development' && applications.length === 0 && (
        <div className="p-4 mb-4 bg-yellow-50 border border-yellow-300 rounded text-sm">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <p>API URL: {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}</p>
          <p>Token exists: {localStorage.getItem("token") ? "Yes" : "No"}</p>
          <p>Campaign ID: {campaignId || "None"}</p>
          <p>Error: {apiError || "None"}</p>
          <div className="mt-2 space-y-2">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={async () => {
                try {
                  const token = localStorage.getItem("token")
                  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
                  const authHeader = token ? `Bearer ${token}` : ""
                  const params = campaignId ? `?campaignId=${campaignId}` : ""
                  
                  const response = await fetch(`${backendUrl}/applications${params}`, {
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': authHeader
                    }
                  })
                  
                  if (response.ok) {
                    const data = await response.json()
                    console.log("Applications from unified endpoint:", data)
                    alert(`Found ${data.length} applications. First application: ${JSON.stringify(data[0], null, 2)}`)
                    
                    // Auto-set applications if found
                    if (Array.isArray(data) && data.length > 0) {
                      setApplications(data)
                    }
                  } else {
                    alert(`Error: ${response.status} ${response.statusText}`)
                  }
                } catch (err) {
                  console.error("Applications test failed:", err)
                  alert("Test failed: " + (err as Error).message)
                }
              }}>
                Test Applications Endpoint
              </Button>
            </div>
            
            {/* Help text */}
            <p className="text-xs text-muted-foreground mt-1">
              If you're seeing this, applications aren't displaying despite being in the database.
              Try the buttons above to troubleshoot.
            </p>
          </div>
        </div>
      )}
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({counts.accepted})</TabsTrigger>
          <TabsTrigger value="shortlisted">Shortlisted ({counts.shortlisted})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({counts.rejected})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {renderApplicationsList(filteredApplications)}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          {renderApplicationsList(filteredApplications)}
        </TabsContent>
        
        <TabsContent value="accepted" className="space-y-4">
          {renderApplicationsList(filteredApplications)}
        </TabsContent>
        
        <TabsContent value="shortlisted" className="space-y-4">
          {renderApplicationsList(filteredApplications)}
        </TabsContent>
        
        <TabsContent value="rejected" className="space-y-4">
          {renderApplicationsList(filteredApplications)}
        </TabsContent>
      </Tabs>
    </div>
  )
  
  function renderApplicationsList(applications: Application[]) {
    if (applications.length === 0) {
      return (
        <div className="text-center py-12">
          {apiError ? (
            <div className="text-red-500 mb-4">
              <p className="font-semibold mb-2">Error connecting to the server:</p>
              <p>{apiError}</p>
              <Button 
                className="mt-4" 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground">No applications found.</p>
              <p className="text-sm text-muted-foreground mt-2">
                There are applications in the database, but they could not be displayed.
                This might be due to a connection issue between the frontend and backend.
              </p>
              <Link href="/dashboard/explore">
                <Button className="mt-4 mr-2" variant="outline">
            Explore Campaigns
          </Button>
              </Link>
              <Button 
                className="mt-4" 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </>
          )}
        </div>
      )
    }
    
    return (
        <div className="space-y-4">
        {applications.map((application) => {
          // Check if we have full campaign data or just basic application data
          const hasFullCampaignData = application.campaign && typeof application.campaign === 'object';
          
          if (!hasFullCampaignData) {
            // Render a simplified card for applications without full campaign data
            return (
              <Card key={application.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Application #{application.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        Campaign ID: {application.campaign_id || "Unknown"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {getStatusBadge(application.status || "Pending")}
                    </div>
                  </div>
                  
                  <div className="bg-secondary/20 p-3 rounded-md mb-4">
                    <p className="text-sm">Applied on: {application.appliedAt ? formatDate(application.appliedAt) : "Unknown date"}</p>
                    {application.message && (
                      <p className="text-sm mt-2">{application.message}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/campaigns/${application.campaign_id}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Campaign
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          }
          
          // The original full application card for applications with campaign data
          return (
            <Card key={application.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-48 h-48 md:h-auto">
                  <ImageWithFallback
                    src={application.campaign?.imageUrl || "/placeholder.svg"}
                    alt={application.campaign?.title || "Campaign"}
                    fill
                    className="object-cover"
                    fallbackSrc="/placeholder.svg"
                  />
                </div>
                <CardContent className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{application.campaign?.title || "Untitled Campaign"}</h3>
                      <div className="flex items-center mt-1">
                        <Avatar className="h-5 w-5 mr-1">
                          <AvatarImage 
                            src={application.campaign?.brand?.logo || "/placeholder.svg"} 
                            alt={application.campaign?.brand?.name || "Brand"} 
                          />
                          <AvatarFallback>
                            {(application.campaign?.brand?.name || "B")[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          {application.campaign?.brand?.name || "Brand"}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm font-medium">Application ID: {application.id}</span>
                        <span className="text-xs text-muted-foreground ml-2">Campaign ID: {application.campaign?.id || application.campaign_id}</span>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center">
                      {getStatusBadge(application.status || "Pending")}
                      <span className="text-sm text-muted-foreground ml-3">
                        Applied on {application.appliedAt ? formatDate(application.appliedAt) : "Unknown date"}
                      </span>
                    </div>
                  </div>

                  {application.message && (
                  <div className="bg-secondary/50 p-3 rounded-md mb-4">
                    <p className="text-sm text-muted-foreground">{application.message}</p>
                  </div>
                  )}

                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/dashboard/messages/${application.campaign?.brand?.id}`)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message Brand
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/campaigns/${application.campaign?.id || application.campaign_id}`}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Campaign
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          );
        })}
    </div>
  )
  }
}
