"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, MessageSquare, Eye, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { campaignService, applicationService } from "@/lib/api-service"
import { useAuth } from "@/components/auth-provider"

interface Campaign {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  startDate?: string;
  endDate?: string;
  requirements?: string;
  budget?: string;
  brand?: {
    id: number;
    name: string;
    logo?: string;
  };
  views?: number;
  applicants?: number;
  saved?: boolean;
}

export function CampaignGallery() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [savedCampaigns, setSavedCampaigns] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [saveEnabled, setSaveEnabled] = useState(true)
  const [consecutiveErrors, setConsecutiveErrors] = useState(0)

  // Separate function to fetch saved campaigns to avoid blocking the main campaign data load
  const fetchSavedCampaignIds = async () => {
    if (user?.role !== "CREATOR") return;
    
    try {
      const savedResponse = await campaignService.getSavedCampaigns();
      
      if (savedResponse && Array.isArray(savedResponse.data)) {
        // Handle different response formats and extract campaign IDs
        const savedIds = savedResponse.data.map((saved: any) => {
          if (saved && typeof saved === 'object') {
            // Handle case where response includes full campaign object
            return saved.campaignId || 
                  (saved.campaign && saved.campaign.id) || 
                  (typeof saved.id === 'number' ? saved.id : null);
          } else if (typeof saved === 'number') {
            // Handle case where response is just an array of IDs
            return saved;
          }
          return null;
        }).filter(Boolean) as number[];
        
        // If we got data from localStorage (indicated by localOnly flag), show a notification
        if ((savedResponse as any).localOnly) {
          toast({
            title: "Using offline data",
            description: "We're showing your saved campaigns from your device since the server couldn't be reached.",
            variant: "default"
          });
        }
        
        console.log('Successfully fetched saved campaign IDs:', savedIds);
        setSavedCampaigns(savedIds);
      } else {
        console.log('No saved campaigns found or unexpected response format');
        setSavedCampaigns([]);
      }
    } catch (error) {
      console.error("Error fetching saved campaigns:", error);
      // Continue with empty saved campaigns
      setSavedCampaigns([]);
      
      // Don't show an error toast here as this is not critical functionality
      // and would create a poor UX to always show errors on page load
    }
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await campaignService.getCampaigns();
        if (response && response.data) {
          setCampaigns(response.data);
        }
        
        // Fetch saved campaigns for creators
        if (user?.role === "CREATOR") {
          await fetchSavedCampaignIds();
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast({
          title: "Error",
          description: "Failed to load campaigns. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [user, toast]);

  const toggleSave = async (campaignId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // If save functionality is disabled, inform the user and return
    if (!saveEnabled) {
      toast({
        title: "Feature Unavailable",
        description: "The save feature is currently unavailable. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    // Store original saved state to restore on failure
    const wasSaved = savedCampaigns.includes(campaignId);
    
    // Optimistic update - update UI state before API call completes
    if (wasSaved) {
      setSavedCampaigns(prev => prev.filter(id => id !== campaignId));
    } else {
      setSavedCampaigns(prev => [...prev, campaignId]);
    }
    
    try {
      if (wasSaved) {
        const response = await campaignService.unsaveCampaign(campaignId.toString());
        
        // Check if this was a local-only operation using type assertion
        const isLocalOnly = (response as any)?.data?.localOnly === true;
        
        toast({
          title: "Campaign unsaved",
          description: isLocalOnly 
            ? "Campaign has been removed from your local saved list. Changes will sync when connection is restored."
            : "Campaign has been removed from your saved list",
        });
        // Reset consecutive errors on success
        setConsecutiveErrors(0);
      } else {
        try {
          const response = await campaignService.saveCampaign(campaignId.toString());
          
          // Check if this was a local-only operation using type assertion
          const isLocalOnly = (response as any)?.data?.localOnly === true;
          
          toast({
            title: "Campaign saved",
            description: isLocalOnly 
              ? "Campaign has been saved locally. It will sync with the server when connection is restored."
              : "Campaign has been added to your saved list",
          });
          // Reset consecutive errors on success
          setConsecutiveErrors(0);
        } catch (saveError: any) {
          // Check if this is the "already saved" error
          const errorData = saveError.response?.data;
          if (errorData && 
             (typeof errorData === 'string' && errorData.includes("already saved") || 
              errorData.message?.includes("already saved"))) {
            // This is actually a success case - the campaign is already saved
            console.log("Campaign was already saved, treating as success");
            toast({
              title: "Campaign saved",
              description: "This campaign is already in your saved list",
            });
            // Reset consecutive errors since this is not a real error
            setConsecutiveErrors(0);
            // No need to roll back the UI state since the campaign should be saved
            return;
          }
          // If it's not the "already saved" error, rethrow to be handled in the outer catch
          throw saveError;
        }
      }
    } catch (error: any) {
      console.error("Error toggling save status:", error);
      
      // Rollback UI state on error
      if (wasSaved) {
        setSavedCampaigns(prev => [...prev, campaignId]);
      } else {
        setSavedCampaigns(prev => prev.filter(id => id !== campaignId));
      }
      
      // Increment consecutive errors
      const newErrorCount = consecutiveErrors + 1;
      setConsecutiveErrors(newErrorCount);
      
      // If we've had several consecutive errors, disable the save functionality
      if (newErrorCount >= 3) {
        setSaveEnabled(false);
        toast({
          title: "Save Feature Disabled",
          description: "We've encountered multiple errors with the save feature. It has been temporarily disabled.",
          variant: "destructive",
        });
      } else {
        // Use the improved error message from the API service
        const errorMsg = error.userMessage || 
                        `Unable to ${wasSaved ? "unsave" : "save"} this campaign. Please try again later.`;
        
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      }
    }
  };

  const applyToCampaign = async (campaignId: number) => {
    try {
      await applicationService.createApplication({
        campaignId: campaignId
      });
      toast({
        title: "Application sent",
        description: "Your application has been submitted successfully!",
      });
      setSelectedCampaign(null);
    } catch (error: any) {
      console.error("Error applying to campaign:", error);
      
      // Use the improved error message from the API service
      const errorMsg = error.userMessage || 
                      "Failed to submit application. Please try again later.";
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
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
  }

  // If no campaigns are available
  if (!campaigns || campaigns.length === 0) {
    return <div className="text-center p-8">
      <p className="text-muted-foreground mb-4">No campaigns available at this time.</p>
      <p className="text-sm">Check back later for new opportunities!</p>
    </div>
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <Card
            key={campaign.id}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedCampaign(campaign)}
          >
            <div className="relative h-48 w-full">
              <Image
                src={campaign.imageUrl || "/placeholder.svg"}
                alt={campaign.title || "Campaign"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <Badge className="mb-2">{campaign.category || "Uncategorized"}</Badge>
                <h3 className="text-lg font-semibold text-white">{campaign.title || "Untitled Campaign"}</h3>
              </div>
              {user?.role === "CREATOR" && (
              <Button
                variant="ghost"
                size="icon"
                className={`absolute top-2 right-2 rounded-full bg-background/80 hover:bg-background ${
                  savedCampaigns.includes(campaign.id) ? "text-red-500" : "text-muted-foreground"
                  } ${!saveEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={(e) => toggleSave(campaign.id, e)}
                  disabled={!saveEnabled}
              >
                <Heart className={`h-5 w-5 ${savedCampaigns.includes(campaign.id) ? "fill-current" : ""}`} />
                  <span className="sr-only">{saveEnabled ? 'Save' : 'Save (Disabled)'}</span>
              </Button>
              )}
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
              <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description || "No description"}</p>
            </CardContent>
            <CardFooter className="px-4 py-3 border-t flex justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {campaign.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {campaign.applicants || 0}
                </span>
              </div>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Ends {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : "N/A"}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedCampaign && (
        <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedCampaign.title || "Untitled Campaign"}</DialogTitle>
              <DialogDescription>by {selectedCampaign.brand?.name || "Brand"}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src={selectedCampaign.imageUrl || "/placeholder.svg"}
                  alt={selectedCampaign.title || "Campaign"}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedCampaign.description || "No description provided."}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Requirements</h4>
                  <p className="text-sm text-muted-foreground">{selectedCampaign.requirements || "No specific requirements"}</p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Campaign Category</h4>
                    <p className="text-sm text-muted-foreground">{selectedCampaign.category || "Uncategorized"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Deadline</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedCampaign.endDate ? new Date(selectedCampaign.endDate).toLocaleDateString() : "No deadline"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {user?.role === "CREATOR" && (
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  toggleSave(selectedCampaign.id, { stopPropagation: () => {} } as React.MouseEvent)
                }}
                  disabled={!saveEnabled}
                  className={!saveEnabled ? "opacity-50 cursor-not-allowed" : ""}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${
                    savedCampaigns.includes(selectedCampaign.id) ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {savedCampaigns.includes(selectedCampaign.id) ? "Saved" : "Save"}
                  {!saveEnabled && " (Disabled)"}
              </Button>
                <Button onClick={() => applyToCampaign(selectedCampaign.id)}>Apply Now</Button>
            </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
