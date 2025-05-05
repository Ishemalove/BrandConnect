"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Grid, List, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { campaignService } from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"
import { applicationService } from "@/lib/api-service"

interface Campaign {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  startDate?: string;
  endDate?: string;
  budget?: string;
  brand?: {
    id: number;
    name: string;
    logo?: string;
  };
}

export function SavedCampaigns() {
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [savedCampaigns, setSavedCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSavedCampaigns = async () => {
      try {
        setLoading(true)
        
        // Add user role check
        const userStr = localStorage.getItem("user");
        let userRole = null;
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            userRole = userData.user?.role;
            console.log("Current user role:", userRole);
          } catch (e) {
            console.error("Error parsing user data:", e);
          }
        }
        
        // Debug network request
        console.log("DEBUG: Starting to fetch saved campaigns");
        
        const response = await campaignService.getSavedCampaigns()
        console.log("DEBUG: API Response for saved campaigns:", response);
        
        if (response && response.data) {
          console.log("Raw saved campaigns response:", response.data);
          
          // Step 1: Extract campaign IDs from the response
          const campaignIds = response.data.map((item: any) => {
            if (!item) return null;
            
            // Log each item for debugging
            console.log("DEBUG: Processing item:", item);
            
            // Handle different response formats to extract campaign ID
            if (item.campaignId) return item.campaignId;
            if (item.campaign && item.campaign.id) return item.campaign.id;
            if (typeof item.id === 'number') return item.id;
            if (item.campaign_id) return item.campaign_id;
            
            return null;
          }).filter(Boolean);
          
          console.log("Extracted campaign IDs:", campaignIds);
          
          // Step 2: Check if we have campaign IDs but no details
          if (campaignIds.length > 0) {
            console.log("DEBUG: Fetching details for campaign IDs:", campaignIds);
            
            // Step 3: Fetch full campaign details for all IDs
            const campaignDetailsPromises = campaignIds.map(id => 
              campaignService.getCampaign(id.toString())
                .then(resp => {
                  console.log(`DEBUG: Got details for campaign ${id}:`, resp.data);
                  return resp.data;
                })
                .catch(err => {
                  console.error(`Error fetching details for campaign ${id}:`, err);
                  // Return a minimal placeholder object on error
                  return {
                    id: id,
                    title: `Campaign ${id}`,
                    description: "Unable to load campaign details",
                    imageUrl: "/placeholder.svg",
                    category: "Uncategorized"
                  };
                })
            );
            
            const campaignDetails = await Promise.all(campaignDetailsPromises);
            console.log("Fetched campaign details:", campaignDetails);
            
            // Filter out any null results
            const validCampaigns = campaignDetails.filter(Boolean);
            console.log("DEBUG: Setting saved campaigns to:", validCampaigns);
            setSavedCampaigns(validCampaigns);
          } else {
            // If no IDs were found, try processing the response as direct campaign objects
            // Extract campaign data from saved campaign objects with better handling of different formats
            const campaigns = response.data.map((item: any) => {
              if (!item) return null;
              
              // Case 1: Full campaign object already available
              if (item.title && item.description) {
                return item;
              }
              
              // Case 2: Nested campaign object
              if (item.campaign && typeof item.campaign === 'object') {
                return item.campaign;
              }
              
              return null;
            }).filter(Boolean);
            
            console.log("Processed saved campaigns as direct objects:", campaigns);
            if (campaigns.length > 0) {
              setSavedCampaigns(campaigns);
            } else {
              setSavedCampaigns([]);
            }
          }
          
          // If we got data from localStorage (indicated by localOnly flag), show a notification
          if ((response as any).localOnly) {
            toast({
              title: "Using offline data",
              description: "We're showing your saved campaigns from your device since the server couldn't be reached.",
              variant: "default"
            });
          }
        } else {
          console.log("DEBUG: No data in response or response is null");
          setSavedCampaigns([]);
        }
      } catch (error) {
        console.error("Error fetching saved campaigns:", error)
        toast({
          title: "Error",
          description: "Failed to load saved campaigns. Please try again later.",
          variant: "destructive",
        })
        setSavedCampaigns([]);
      } finally {
        setLoading(false)
      }
    }

    fetchSavedCampaigns()
  }, [toast])
  
  // We don't need the separate fetchCampaignDetails function anymore as we now 
  // fetch all campaign details in the main function

  const handleUnsave = async (campaignId: number) => {
    try {
      await campaignService.unsaveCampaign(campaignId.toString())
      setSavedCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId))
      toast({
        title: "Campaign unsaved",
        description: "Campaign has been removed from your saved list",
      })
    } catch (error: any) {
      console.error("Error unsaving campaign:", error)
      
      // Check for specific error messages
      const errorData = error.response?.data;
      if (error.response?.status === 400 && 
          errorData && 
          (typeof errorData === 'string' && errorData.includes("not found") || 
           errorData.message?.includes("not found"))) {
        // If the saved campaign wasn't found, we can consider this a success case
        // since the end goal is the campaign not being in the saved list
        setSavedCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId))
        toast({
          title: "Campaign removed",
          description: "The campaign is no longer in your saved list",
        })
        return;
      }
      
      // For other errors, show an error message
      toast({
        title: "Error",
        description: error.userMessage || "Failed to unsave the campaign. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  const handleApply = async (campaignId: number) => {
    try {
      await applicationService.createApplication({
        campaignId: campaignId
      })
      
      toast({
        title: "Application sent",
        description: "Your application has been submitted successfully!",
      })
    } catch (error) {
      console.error("Error applying to campaign:", error)
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="overflow-hidden">
            <div className="h-48 bg-muted animate-pulse" />
            <CardContent className="p-4">
              <div className="h-4 w-1/4 bg-muted rounded animate-pulse mb-2" />
              <div className="h-6 bg-muted rounded animate-pulse mb-4" />
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (savedCampaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-muted-foreground mb-4">
          <Heart className="h-full w-full" />
        </div>
        <h3 className="text-xl font-medium mb-2">No saved campaigns</h3>
        <p className="text-muted-foreground mb-6">
          You haven't saved any campaigns yet. Browse campaigns and save the ones you're interested in.
        </p>
        <Link href="/dashboard/explore">
        <Button>Explore Campaigns</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Saved Campaigns</h2>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
            <Grid className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCampaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                  src={campaign.imageUrl || "/placeholder.svg"}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Badge className="mb-2">{campaign.category}</Badge>
                    <h3 className="text-lg font-semibold text-white">{campaign.title}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full bg-background/80 hover:bg-background text-red-500"
                  onClick={() => handleUnsave(campaign.id)}
                  >
                    <Heart className="h-5 w-5 fill-current" />
                    <span className="sr-only">Unsave</span>
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-full overflow-hidden relative">
                      <Image
                      src={campaign.brand?.logo || "/placeholder.svg"}
                      alt={campaign.brand?.name || "Brand"}
                        fill
                        className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                      />
                    </div>
                  <span className="font-medium">{campaign.brand?.name || "Brand"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
                </CardContent>
                <CardFooter className="px-4 py-3 border-t flex justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                  <span>Ends {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : "No end date"}</span>
                  </div>
                <Button 
                  size="sm"
                  onClick={() => handleApply(campaign.id)}
                >
                  Apply Now
                </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      ) : (
        <div className="space-y-4">
          {savedCampaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="relative h-48 md:h-auto md:w-64">
                    <Image
                    src={campaign.imageUrl || "/placeholder.svg"}
                      alt={campaign.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 256px"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="mb-2">{campaign.category}</Badge>
                        <h3 className="text-lg font-semibold">{campaign.title}</h3>
                        <div className="flex items-center gap-2 mt-1 mb-3">
                          <div className="h-6 w-6 rounded-full overflow-hidden relative">
                            <Image
                            src={campaign.brand?.logo || "/placeholder.svg"}
                            alt={campaign.brand?.name || "Brand"}
                              fill
                              className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                            />
                          </div>
                        <span className="text-sm">{campaign.brand?.name || "Brand"}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                      onClick={() => handleUnsave(campaign.id)}
                      >
                        <Heart className="h-5 w-5 fill-current" />
                        <span className="sr-only">Unsave</span>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                        <span>Deadline: {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : "No end date"}</span>
                        </div>
                      <div className="text-sm">Budget: {campaign.budget || "Not specified"}</div>
                      </div>
                      <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/campaigns/${campaign.id}`}>
                          <ExternalLink className="h-4 w-4 mr-1" /> View
                        </Link>
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleApply(campaign.id)}
                      >
                        Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  )
}
