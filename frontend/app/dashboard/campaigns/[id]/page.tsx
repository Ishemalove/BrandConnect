"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { campaignService, applicationService } from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import Link from "next/link"
import { ApplicationForm } from "@/components/application-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Heart, Calendar, User, FileText, Package, Globe, ArrowLeft, ChevronLeft } from "lucide-react"

export default function CampaignDetailPage() {
  const params = useParams()
  const campaignId = params.id as string
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hasApplied, setHasApplied] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true)
        const response = await campaignService.getCampaign(campaignId)
        setCampaign(response.data)
        
        // Check if user has already applied
        if (user?.role === "CREATOR") {
          try {
            const applicationsResponse = await applicationService.getApplications()
            const applications = applicationsResponse.data || []
            
            // Check if any application matches this campaign
            const hasExistingApplication = applications.some(
              (app: any) => app.campaign?.id === Number(campaignId)
            )
            
            setHasApplied(hasExistingApplication)
          } catch (error) {
            console.error("Error checking existing applications:", error)
          }
        }
      } catch (error) {
        console.error("Error fetching campaign:", error)
        toast({
          title: "Error",
          description: "Failed to load campaign details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    if (campaignId) {
      fetchCampaign()
    }
  }, [campaignId, user, toast])
  
  const handleApply = () => {
    setShowApplicationForm(true)
  }
  
  const handleApplicationSuccess = () => {
    setHasApplied(true)
    setShowApplicationForm(false)
    toast({
      title: "Application Submitted",
      description: "Your application has been successfully submitted. The brand will review it soon.",
    })
  }
  
  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
        </div>
      </div>
    )
  }
  
  if (!campaign) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-xl font-medium mb-2">Campaign Not Found</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            We couldn't find the campaign you're looking for.
          </p>
          <Link href="/dashboard/campaigns">
            <Button variant="outline">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </Button>
          </Link>
        </div>
      </div>
    )
  }
  
  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  
  // Determine if campaign is active
  const now = new Date().toISOString().split('T')[0]
  const isActive = campaign.startDate <= now && (!campaign.endDate || campaign.endDate >= now)
  
  // Determine if creator can apply
  const canApply = isActive && user?.role === "CREATOR" && !hasApplied
  
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/campaigns">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden">
            <Image 
              src={campaign.imageUrl || "/placeholder.svg"} 
              alt={campaign.title} 
              fill 
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
            
            {isActive && (
              <div className="absolute top-4 left-4 bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-md">
                Active Campaign
              </div>
            )}
            
            {campaign.endDate && (
              <div className="absolute bottom-4 left-4 bg-black/70 text-white text-sm font-medium px-3 py-1 rounded-md flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Ends {formatDate(campaign.endDate)}
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
            
            <div className="flex items-center mb-4">
              {campaign.brand && (
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage 
                      src={campaign.brand.logoUrl || "/placeholder.svg"} 
                      alt={campaign.brand.name} 
                    />
                    <AvatarFallback>
                      {campaign.brand.name ? campaign.brand.name[0] : 'B'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">
                    {campaign.brand.name || "Brand"}
                  </span>
                </div>
              )}
              
              <Badge variant="outline" className="ml-4">
                {campaign.category || "General"}
              </Badge>
              
              {campaign.campaignType && (
                <Badge variant="secondary" className="ml-2">
                  {campaign.campaignType}
                </Badge>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Campaign Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {campaign.description || "No description provided."}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    Start: {formatDate(campaign.startDate)}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    End: {formatDate(campaign.endDate)}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    Platform: {campaign.platform || "Multiple"}
                  </span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="requirements">
              <div>
                <h3 className="font-semibold mb-2">Campaign Requirements</h3>
                <div className="text-muted-foreground whitespace-pre-wrap">
                  {campaign.requirements ? (
                    <div dangerouslySetInnerHTML={{ __html: campaign.requirements.replace(/\n/g, '<br/>') }} />
                  ) : (
                    <ul className="list-disc pl-5">
                      <li>Minimum 10k followers on Instagram or TikTok</li>
                      <li>Previous experience with similar brands</li>
                      <li>Ability to create high-quality content</li>
                      <li>Available for content creation in the next 2 weeks</li>
                    </ul>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="deliverables">
              <div>
                <h3 className="font-semibold mb-2">Campaign Deliverables</h3>
                <div className="text-muted-foreground whitespace-pre-wrap">
                  {campaign.deliverables ? (
                    <div dangerouslySetInnerHTML={{ __html: campaign.deliverables.replace(/\n/g, '<br/>') }} />
                  ) : (
                    <ul className="list-disc pl-5">
                      <li>2 Instagram posts</li>
                      <li>3 Instagram stories</li>
                      <li>1 TikTok video</li>
                    </ul>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Status</CardTitle>
              <CardDescription>
                {isActive ? "This campaign is currently active" : "This campaign is not active"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge className={isActive ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                  {isActive ? "Active" : campaign.startDate > now ? "Upcoming" : "Ended"}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Duration:</span>
                <span className="text-sm font-medium">
                  {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                </span>
              </div>
              
              {campaign.budget && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Budget:</span>
                  <span className="text-sm font-medium">
                    {typeof campaign.budget === 'number' 
                      ? `$${campaign.budget.toLocaleString()}` 
                      : campaign.budget}
                  </span>
                </div>
              )}
              
              {campaign.compensation && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Compensation:</span>
                  <span className="text-sm font-medium">{campaign.compensation}</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {canApply && (
                <Button className="w-full" onClick={handleApply}>
                  Apply for Campaign
                </Button>
              )}
              
              {hasApplied && (
                <Button className="w-full" variant="outline" disabled>
                  Already Applied
                </Button>
              )}
              
              {!isActive && (
                <Button className="w-full" variant="outline" disabled>
                  {campaign.startDate > now ? "Campaign Not Started" : "Campaign Ended"}
                </Button>
              )}
              
              {isActive && user?.role === "BRAND" && (
                <Link href={`/dashboard/interested?campaign=${campaignId}`} className="w-full">
                  <Button className="w-full">
                    View Applications
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Creator Requirements</CardTitle>
              <CardDescription>What brands are looking for</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Followers: 10K+</span>
              </div>
              
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Content Type: Photo, Video</span>
              </div>
              
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Deliverables: 3-5 pieces</span>
              </div>
              
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Platforms: Instagram, TikTok</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Application Form Dialog */}
      {showApplicationForm && (
        <ApplicationForm 
          campaignId={campaignId}
          isOpen={showApplicationForm}
          onClose={() => setShowApplicationForm(false)}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  )
} 