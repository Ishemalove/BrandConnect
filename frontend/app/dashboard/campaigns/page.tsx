"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Filter, ArrowUpDown, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { campaignService } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { Pagination } from "@/components/ui/pagination"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

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
  imageEndpoint?: string;
}

export default function CampaignsPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  // Get query parameters with defaults
  const initialQuery = searchParams?.get('query') || ''
  const initialSort = searchParams?.get('sort') || 'newest'
  const initialPage = parseInt(searchParams?.get('page') || '1', 10)
  const initialStatus = searchParams?.get('status') || 'active'
  
  // Set state from URL parameters
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState<string>(initialQuery)
  const [sortBy, setSortBy] = useState<string>(initialSort)
  const [activeTab, setActiveTab] = useState<string>(initialStatus)
  const [currentPage, setCurrentPage] = useState<number>(initialPage)
  const [itemsPerPage] = useState<number>(6)
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)

  // Update URL when parameters change
  const createQueryString = (params: Record<string, string | number | null>) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString() || '')
    
    Object.entries(params).forEach(([name, value]) => {
      if (value === null) {
        newSearchParams.delete(name)
      } else {
        newSearchParams.set(name, value.toString())
      }
    })
    
    return newSearchParams.toString()
  }
  
  // Update URL when filter parameters change
  useEffect(() => {
    const newQueryString = createQueryString({
      query: debouncedQuery || null,
      sort: sortBy,
      status: activeTab,
      page: currentPage === 1 ? null : currentPage,
    })
    
    router.push(`${pathname}?${newQueryString}`, { scroll: false })
  }, [debouncedQuery, sortBy, activeTab, currentPage, pathname, router])
  
  // Debounce search query to avoid too many URL updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery)
      // Reset to page 1 when search query changes
      if (currentPage !== 1) {
        setCurrentPage(1)
      }
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [searchQuery, currentPage])

  useEffect(() => {
    // Fetch campaigns on component mount
    const fetchCampaigns = async () => {
      try {
        setLoading(true)
        console.log('Starting to fetch campaigns...');
        
        try {
          const params = {
            sort: sortBy,
            page: currentPage,
            size: itemsPerPage
          };
          
          const response = await campaignService.getCampaigns(params)
          console.log('Campaigns response received successfully');
          console.log('Raw campaign data:', response.data);
          
          // Check if the response is in the expected format
          let campaignsData = response.data;
          if (Array.isArray(campaignsData)) {
            setCampaigns(campaignsData);
            setTotalPages(Math.ceil(campaignsData.length / itemsPerPage));
            console.log('Successfully set campaigns state with', campaignsData.length, 'campaigns');
          } else if (campaignsData && typeof campaignsData === 'object') {
            // Maybe the data is nested in a property?
            if (Array.isArray(campaignsData.content)) {
              setCampaigns(campaignsData.content);
              
              // Handle pagination data if available
              if (campaignsData.totalPages) {
                setTotalPages(campaignsData.totalPages);
              } else {
                setTotalPages(Math.ceil(campaignsData.content.length / itemsPerPage));
              }
              
              console.log('Successfully set campaigns from nested content with', campaignsData.content.length, 'campaigns');
            } else {
              // If it's an object but not an array, try to convert it
              const campaignArray = Object.values(campaignsData);
              if (campaignArray.length > 0) {
                setCampaigns(campaignArray as Campaign[]);
                setTotalPages(Math.ceil(campaignArray.length / itemsPerPage));
                console.log('Converted object to array with', campaignArray.length, 'campaigns');
              } else {
                console.error('Received data is not a valid campaign array:', campaignsData);
                setCampaigns([]);
                setTotalPages(1);
              }
            }
          } else {
            console.error('Unexpected response format:', campaignsData);
            setCampaigns([]);
            setTotalPages(1);
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
          setTotalPages(1);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns()
  }, [sortBy, currentPage, itemsPerPage])

  // Apply search filter and active tab filter client-side
  useEffect(() => {
    // Filter campaigns based on status
    const filterByStatus = (campaigns: Campaign[]) => {
      const now = new Date().toISOString().split('T')[0]
      
      switch (activeTab) {
        case 'active':
          return campaigns.filter(campaign => 
            campaign.startDate <= now && 
            (!campaign.endDate || campaign.endDate >= now)
          )
        case 'draft':
          return campaigns.filter(campaign => campaign.startDate > now)
        case 'completed':
          return campaigns.filter(campaign => 
            campaign.endDate && campaign.endDate < now
          )
        default:
          return campaigns
      }
    }
    
    // Then apply search filter if needed
    let filtered = filterByStatus(campaigns)
    
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (campaign) => 
          campaign.title.toLowerCase().includes(query) ||
          campaign.description.toLowerCase().includes(query) ||
          campaign.category.toLowerCase().includes(query)
      )
    }
    
    setFilteredCampaigns(filtered)
  }, [debouncedQuery, campaigns, activeTab])
  
  // Handle status tab change
  const handleStatusChange = (value: string) => {
    setActiveTab(value)
    setCurrentPage(1) // Reset to page 1 when status changes
  }
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value)
    setCurrentPage(1) // Reset to page 1 when sort changes
  }
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Get campaigns for current page
  const displayCampaigns = filteredCampaigns
  const totalFilteredItems = filteredCampaigns.length
  const totalFilteredPages = Math.max(1, Math.ceil(totalFilteredItems / itemsPerPage))

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Campaigns</h1>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Campaigns</SheetTitle>
                <SheetDescription>Refine your campaign list</SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Sort By</h3>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="ending">Ending Soon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="ending">Ending Soon</SelectItem>
            </SelectContent>
          </Select>
          
          <Link href="/dashboard/campaigns/new">
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
        <Tabs value={activeTab} onValueChange={handleStatusChange} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active ({filteredCampaigns.filter(c => {
              const now = new Date().toISOString().split('T')[0];
              return c.startDate <= now && (!c.endDate || c.endDate >= now);
            }).length})</TabsTrigger>
            <TabsTrigger value="draft">Draft ({filteredCampaigns.filter(c => {
              const now = new Date().toISOString().split('T')[0];
              return c.startDate > now;
            }).length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({filteredCampaigns.filter(c => {
              const now = new Date().toISOString().split('T')[0];
              return c.endDate && c.endDate < now;
            }).length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayCampaigns.length === 0 ? (
                <div className="col-span-3 py-12 text-center">
                  <p className="text-muted-foreground">
                    {debouncedQuery ? "No campaigns found matching your search." : "No active campaigns"}
                  </p>
                </div>
              ) : (
                displayCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader className="p-4 pb-2">
                      <div className="relative w-full h-40 mb-2">
                        <ImageWithFallback
                          src={campaign.imageEndpoint || "/placeholder.jpg"}
                          alt={campaign.title}
                          fill
                          className="object-cover rounded-md"
                          fallbackSrc="/placeholder.jpg"
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
            
            {totalFilteredPages > 1 && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalFilteredPages} 
                onPageChange={handlePageChange} 
              />
            )}
          </TabsContent>

          <TabsContent value="draft" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayCampaigns.length === 0 ? (
                <div className="col-span-3 py-12 text-center">
                  <p className="text-muted-foreground">
                    {debouncedQuery ? "No campaigns found matching your search." : "No draft campaigns"}
                  </p>
                </div>
              ) : (
                displayCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader className="p-4 pb-2">
                      <div className="relative w-full h-40 mb-2">
                        <ImageWithFallback
                          src={campaign.imageEndpoint || "/placeholder.jpg"}
                          alt={campaign.title}
                          fill
                          className="object-cover rounded-md"
                          fallbackSrc="/placeholder.jpg"
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
            
            {totalFilteredPages > 1 && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalFilteredPages} 
                onPageChange={handlePageChange} 
              />
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayCampaigns.length === 0 ? (
                <div className="col-span-3 py-12 text-center">
                  <p className="text-muted-foreground">
                    {debouncedQuery ? "No campaigns found matching your search." : "No completed campaigns"}
                  </p>
                </div>
              ) : (
                displayCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader className="p-4 pb-2">
                      <div className="relative w-full h-40 mb-2">
                        <ImageWithFallback
                          src={campaign.imageEndpoint || "/placeholder.jpg"}
                          alt={campaign.title}
                          fill
                          className="object-cover rounded-md"
                          fallbackSrc="/placeholder.jpg"
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
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Completed</span>
                      <Link href={`/dashboard/campaigns/${campaign.id}`}>
                        <Button variant="outline" size="sm">
                          View Results
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
            
            {totalFilteredPages > 1 && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalFilteredPages} 
                onPageChange={handlePageChange} 
              />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
