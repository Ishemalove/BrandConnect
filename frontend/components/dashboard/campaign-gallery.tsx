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
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { Pagination } from "@/components/ui/pagination"

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

interface CampaignGalleryProps {
  searchQuery?: string;
  sortBy?: string;
  category?: string;
  page?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export function CampaignGallery({ 
  searchQuery = "", 
  sortBy = "newest", 
  category = "all", 
  page = 1, 
  itemsPerPage = 6,
  onPageChange
}: CampaignGalleryProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([])
  const [savedCampaigns, setSavedCampaigns] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [saveEnabled, setSaveEnabled] = useState(true)
  const [consecutiveErrors, setConsecutiveErrors] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

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
        const params = {
          sort: sortBy,
          category: category !== 'all' ? category : undefined,
          page,
          size: itemsPerPage
        };
        
        const response = await campaignService.getCampaigns(params);
        if (response && response.data) {
          setCampaigns(response.data.content || response.data);
          
          // Handle pagination data if available
          if (response.data.totalElements) {
            setTotalItems(response.data.totalElements);
            setTotalPages(response.data.totalPages || Math.ceil(response.data.totalElements / itemsPerPage));
          } else {
            // If pagination data not available, use array length
            setTotalItems(response.data.length);
            setTotalPages(Math.ceil(response.data.length / itemsPerPage));
          }
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
  }, [user, toast, sortBy, category, page, itemsPerPage]);

  // Apply search filter client-side
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCampaigns(campaigns);
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const filtered = campaigns.filter(
      (campaign) => 
        campaign.title.toLowerCase().includes(query) ||
        campaign.description.toLowerCase().includes(query) ||
        campaign.category.toLowerCase().includes(query) ||
        (campaign.brand?.name && campaign.brand.name.toLowerCase().includes(query))
    );
    
    setFilteredCampaigns(filtered);
  }, [searchQuery, campaigns]);

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

  // Display filtered campaigns or all campaigns if no search query
  const displayCampaigns = searchQuery ? filteredCampaigns : campaigns;

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-200 dark:bg-gray-800" />
            <CardContent className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (displayCampaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          {searchQuery ? "No campaigns found matching your search." : "No campaigns available at this time."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCampaigns.map((campaign) => (
          <Card key={campaign.id} className="overflow-hidden cursor-pointer transition-shadow hover:shadow-md" onClick={() => setSelectedCampaign(campaign)}>
            <div className="aspect-video relative bg-muted">
              <ImageWithFallback
                src={campaign.imageUrl || "/placeholder.jpg"}
                alt={campaign.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                fallbackSrc="/placeholder.jpg"
              />
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="text-xs capitalize">
                  {campaign.category}
                </Badge>
              </div>
              {user?.role === "CREATOR" && (
                <Button
                  variant="outline"
                  size="icon"
                  className={`absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm ${
                    savedCampaigns.includes(campaign.id) ? "text-red-500" : "text-muted-foreground"
                  }`}
                  onClick={(e) => toggleSave(campaign.id, e)}
                >
                  <Heart className={`h-4 w-4 ${savedCampaigns.includes(campaign.id) ? "fill-current" : ""}`} />
                </Button>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold tracking-tight mb-2 line-clamp-1">{campaign.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{campaign.description}</p>
              <div className="flex items-center gap-2">
                {campaign.brand?.logo ? (
                  <Image
                    src={campaign.brand.logo}
                    alt={campaign.brand.name}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-muted" />
                )}
                <span className="text-xs text-muted-foreground">{campaign.brand?.name || "Brand"}</span>
              </div>
            </CardContent>
            <CardFooter className="px-4 py-3 border-t flex justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Eye className="h-3 w-3" />
                <span>{campaign.views || 0}</span>
                <MessageSquare className="h-3 w-3 ml-2" />
                <span>{campaign.applicants || 0}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>
                  Ends {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : "Soon"}
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={onPageChange || ((newPage) => console.log("Page changed to", newPage))} 
        />
      )}

      {selectedCampaign && (
        <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedCampaign.title}</DialogTitle>
              <DialogDescription>{selectedCampaign.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video relative rounded-md overflow-hidden">
                <ImageWithFallback
                  src={selectedCampaign.imageUrl || "/placeholder.jpg"}
                  alt={selectedCampaign.title}
                  fill
                  className="object-cover"
                  fallbackSrc="/placeholder.jpg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Brand</h4>
                  <p className="text-sm text-muted-foreground">{selectedCampaign.brand?.name || "Unknown"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Category</h4>
                  <p className="text-sm text-muted-foreground capitalize">{selectedCampaign.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Budget</h4>
                  <p className="text-sm text-muted-foreground">{selectedCampaign.budget || "Not specified"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Timeline</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedCampaign.startDate && selectedCampaign.endDate
                      ? `${new Date(selectedCampaign.startDate).toLocaleDateString()} - ${new Date(
                          selectedCampaign.endDate,
                        ).toLocaleDateString()}`
                      : "Not specified"}
                  </p>
                </div>
              </div>
              {selectedCampaign.requirements && (
                <div>
                  <h4 className="text-sm font-medium">Requirements</h4>
                  <p className="text-sm text-muted-foreground">{selectedCampaign.requirements}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {user?.role === "CREATOR" && (
                <>
                  <Button className="flex-1" onClick={() => applyToCampaign(selectedCampaign.id)}>
                    Apply Now
                  </Button>
                  <Button
                    variant="outline"
                    className={savedCampaigns.includes(selectedCampaign.id) ? "text-red-500" : ""}
                    onClick={(e) => toggleSave(selectedCampaign.id, e)}
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${
                        savedCampaigns.includes(selectedCampaign.id) ? "fill-current" : ""
                      }`}
                    />
                    {savedCampaigns.includes(selectedCampaign.id) ? "Saved" : "Save"}
                  </Button>
                </>
              )}
              {user?.role === "BRAND" && (
                <Button className="flex-1" asChild>
                  <a href={`/dashboard/campaigns/${selectedCampaign.id}`}>View Details</a>
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
