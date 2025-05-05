"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Filter, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { campaignService } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

// Campaign type
interface Campaign {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  requirements: string;
  deliverables: string;
  campaignType: string;
}

export default function CampaignsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("active")
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch campaigns on component mount
    const fetchCampaigns = async () => {
      try {
        setLoading(true)
        console.log('Starting to fetch campaigns...');
        
        try {
        const response = await campaignService.getCampaigns()
          console.log('Campaigns response received successfully');
        console.log('Raw campaign data:', response.data);
        
        // Check if the response is in the expected format
        let campaignsData = response.data;
        if (Array.isArray(campaignsData)) {
          setCampaigns(campaignsData);
          console.log('Successfully set campaigns state with', campaignsData.length, 'campaigns');
        } else if (campaignsData && typeof campaignsData === 'object') {
          // Maybe the data is nested in a property?
          if (Array.isArray(campaignsData.content)) {
            setCampaigns(campaignsData.content);
            console.log('Successfully set campaigns from nested content with', campaignsData.content.length, 'campaigns');
          } else {
            // If it's an object but not an array, try to convert it
            const campaignArray = Object.values(campaignsData);
            if (campaignArray.length > 0) {
              setCampaigns(campaignArray as Campaign[]);
              console.log('Converted object to array with', campaignArray.length, 'campaigns');
            } else {
              console.error('Received data is not a valid campaign array:', campaignsData);
              setCampaigns([]);
            }
          }
        } else {
          console.error('Unexpected response format:', campaignsData);
          setCampaigns([]);
        }
        } catch (error: any) {
          console.error('Error fetching campaigns:', error);
          console.error('Error details:', error.response?.data || error.message);
        toast({
          title: "Error",
            description: "Failed to load campaigns",
          variant: "destructive",
          });
        setCampaigns([]);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns()
  }, [])

  // Filter campaigns based on status (we'll determine this by date)
  const getActiveCampaigns = () => {
    const now = new Date().toISOString().split('T')[0]
    return campaigns.filter(campaign => 
      campaign.startDate <= now && 
      (!campaign.endDate || campaign.endDate >= now)
    )
  }

  const getDraftCampaigns = () => {
    const now = new Date().toISOString().split('T')[0]
    return campaigns.filter(campaign => campaign.startDate > now)
  }

  const getCompletedCampaigns = () => {
    const now = new Date().toISOString().split('T')[0]
    return campaigns.filter(campaign => 
      campaign.endDate && campaign.endDate < now
    )
  }

  // Get campaigns for each tab
  const activeCampaigns = getActiveCampaigns()
  const draftCampaigns = getDraftCampaigns()
  const completedCampaigns = getCompletedCampaigns()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Campaigns</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort
          </Button>
          <Link href="/dashboard/campaigns/new">
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <h3 className="text-xl font-semibold mb-2">No campaigns found</h3>
          <p className="text-muted-foreground mb-4">Create your first campaign to get started</p>
          <Link href="/dashboard/campaigns/new">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </Link>
        </div>
      ) : (
        <Tabs defaultValue="active" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active ({activeCampaigns.length})</TabsTrigger>
            <TabsTrigger value="draft">Draft ({draftCampaigns.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedCampaigns.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCampaigns.length === 0 ? (
                <div className="col-span-3 py-12 text-center">
                  <p className="text-muted-foreground">No active campaigns</p>
                </div>
              ) : (
                activeCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader className="p-4 pb-2">
                      <div className="relative w-full h-40 mb-2">
                        <ImageWithFallback
                          src={campaign.imageUrl || "/placeholder.svg"}
                          alt={campaign.title}
                          fill
                          className="object-cover rounded-md"
                          fallbackSrc="/placeholder.svg"
                        />
                      </div>
                      <CardTitle className="text-lg">{campaign.title}</CardTitle>
                      <CardDescription>{campaign.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {campaign.description}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span>Type: {campaign.campaignType}</span>
                        <span>Ends: {new Date(campaign.endDate).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                      <Link href={`/dashboard/campaigns/${campaign.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {draftCampaigns.length === 0 ? (
                <div className="col-span-3 py-12 text-center">
                  <p className="text-muted-foreground">No draft campaigns</p>
                </div>
              ) : (
                draftCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader className="p-4 pb-2">
                      <div className="relative w-full h-40 mb-2">
                        <ImageWithFallback
                          src={campaign.imageUrl || "/placeholder.svg"}
                          alt={campaign.title}
                          fill
                          className="object-cover rounded-md"
                          fallbackSrc="/placeholder.svg"
                        />
                      </div>
                      <CardTitle className="text-lg">{campaign.title}</CardTitle>
                      <CardDescription>{campaign.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {campaign.description}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span>Type: {campaign.campaignType}</span>
                        <span>Starts: {new Date(campaign.startDate).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Draft</span>
                      <Link href={`/dashboard/campaigns/${campaign.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedCampaigns.length === 0 ? (
                <div className="col-span-3 py-12 text-center">
                  <p className="text-muted-foreground">No completed campaigns</p>
                </div>
              ) : (
                completedCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader className="p-4 pb-2">
                      <div className="relative w-full h-40 mb-2">
                        <ImageWithFallback
                          src={campaign.imageUrl || "/placeholder.svg"}
                          alt={campaign.title}
                          fill
                          className="object-cover rounded-md"
                          fallbackSrc="/placeholder.svg"
                        />
                      </div>
                      <CardTitle className="text-lg">{campaign.title}</CardTitle>
                      <CardDescription>{campaign.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {campaign.description}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span>Type: {campaign.campaignType}</span>
                        <span>Ended: {new Date(campaign.endDate).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Completed</span>
                      <Link href={`/dashboard/campaigns/${campaign.id}`}>
                        <Button variant="outline" size="sm">
                          View Report
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
