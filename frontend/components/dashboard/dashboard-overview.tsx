"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { statisticsService, campaignService } from "@/lib/api-service"
import { 
  BarChart, 
  Users, 
  TrendingUp, 
  Heart, 
  Briefcase,
  PlusCircle,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { StatisticsSidebar } from "@/components/dashboard/statistics-sidebar"
import { 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts"

const COLORS = ["#ea4c89", "#38bdf8", "#4ade80", "#f97316"]

interface DashboardStats {
  totalCampaigns?: number;
  campaignsChange?: number;
  activeCreators?: number;
  creatorsChange?: number;
  engagementRate?: number;
  engagementChange?: number;
  savedCampaigns?: number;
  savedChange?: number;
  applicationsSent?: number;
  pendingApplications?: number;
  profileViews?: number;
  profileViewsChange?: number;
  categoryDistribution?: Record<string, number>;
  campaignPerformance?: Array<{
    name: string;
    views: number;
    applications: number;
    engagement: number;
  }>;
}

interface Campaign {
  id: number;
  title: string;
  imageUrl: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  imageEndpoint?: string;
}

export function DashboardOverview() {
  const { user } = useAuth()
  const isBrand = user?.role === "BRAND"
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch dashboard statistics
        const dashboardStats = await statisticsService.getDashboardStats()
        setStats(dashboardStats)
        
        // Fetch recent campaigns
        const campaignsResponse = await campaignService.getCampaigns({ sort: 'startDate,desc' })

        if (campaignsResponse && campaignsResponse.data) {
          // If the response is paginated (like from Spring Data JPA Page), access content
          const campaignsData = Array.isArray(campaignsResponse.data.content) 
            ? campaignsResponse.data.content 
            : campaignsResponse.data;

          // Ensure we have an array before slicing
          if (Array.isArray(campaignsData)) {
             // Filter campaigns to only show those with an end date in the future or no end date
            const now = new Date().toISOString().split('T')[0];
            const activeOrUpcomingCampaigns = campaignsData.filter(campaign => 
               !campaign.endDate || campaign.endDate >= now
            );
            setRecentCampaigns(activeOrUpcomingCampaigns.slice(0, 3)); // Take up to 3 active/upcoming campaigns
            console.log('Fetched and filtered recent campaigns for dashboard:', activeOrUpcomingCampaigns.slice(0, 3));
          } else {
            console.error('Unexpected campaign data format for recent campaigns:', campaignsData);
            setRecentCampaigns([]);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  // Convert category distribution to pie chart data
  const getCategoryChartData = () => {
    if (!stats?.categoryDistribution) return [];
    
    return Object.entries(stats.categoryDistribution).map(([name, value]) => ({
      name,
      value,
    }));
  }
  
  const categoryChartData = getCategoryChartData();

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-1" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-1" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[240px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-1" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[240px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Brand dashboard view
  if (isBrand) {
    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your campaigns today.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalCampaigns || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.campaignsChange && stats.campaignsChange > 0 ? "+" : ""}
                  {stats?.campaignsChange || 0} from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Creators</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeCreators || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.creatorsChange && stats.creatorsChange > 0 ? "+" : ""}
                  {stats?.creatorsChange || 0} since last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.engagementRate || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.engagementChange && stats.engagementChange > 0 ? "+" : ""}
                  {stats?.engagementChange || 0}% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Views and applications per campaign</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={stats?.campaignPerformance || []}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="views" name="Views (100s)" fill="#38bdf8" />
                      <Bar dataKey="applications" name="Applications" fill="#ea4c89" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Creator Categories</CardTitle>
                <CardDescription>Top creator categories by interest</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Campaigns</CardTitle>
                  <Link href="/dashboard/campaigns">
                    <Button variant="ghost" className="gap-1">
                      View All
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentCampaigns.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    {recentCampaigns.map((campaign) => {
                      // Calculate status based on dates
                      const now = new Date();
                      const startDate = campaign.startDate ? new Date(campaign.startDate) : null;
                      const endDate = campaign.endDate ? new Date(campaign.endDate) : null;
                      
                      let status = "Draft";
                      if (startDate && startDate <= now && (!endDate || endDate >= now)) {
                        status = "Active";
                      } else if (endDate && endDate < now) {
                        status = "Completed";
                      }
                      
                      return (
                        <Link href={`/dashboard/campaigns/${campaign.id}`} key={campaign.id}>
                          <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                            <div className="relative h-40">
                              <Image
                                src={campaign.imageEndpoint || "/placeholder.svg"}
                                alt={campaign.title}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  // Fallback if image fails to load
                                  e.currentTarget.src = "/placeholder.svg";
                                }}
                              />
                              <div
                                className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                                  status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : status === "Completed"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {status}
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-medium mb-1">{campaign.title}</h3>
                              <p className="text-xs text-muted-foreground">
                                {campaign.category || "General"} • Ends: {campaign.endDate
                                  ? new Date(campaign.endDate).toLocaleDateString()
                                  : "No end date"}
                              </p>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No campaigns found</p>
                    <Link href="/dashboard/campaigns/new">
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Campaign
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <StatisticsSidebar />
      </div>
    )
  }
  
  // Creator dashboard view
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Find campaigns that match your profile.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Campaigns</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.savedCampaigns || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.savedChange && stats.savedChange > 0 ? "+" : ""}
                {stats?.savedChange || 0} this week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications Sent</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.applicationsSent || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.pendingApplications || 0} pending responses
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.profileViews || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.profileViewsChange && stats.profileViewsChange > 0 ? "+" : ""}
                {stats?.profileViewsChange || 0}% from last week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Available Campaigns</CardTitle>
                <Link href="/dashboard/explore">
                  <Button variant="ghost" className="gap-1">
                    Explore More
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentCampaigns.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-3">
                  {recentCampaigns.map((campaign) => {
                    // Calculate status based on dates
                    const now = new Date();
                    const startDate = campaign.startDate ? new Date(campaign.startDate) : null;
                    const endDate = campaign.endDate ? new Date(campaign.endDate) : null;
                    
                    // Only show active campaigns for creators
                    if (startDate && startDate > now) return null;
                    if (endDate && endDate < now) return null;
                    
                    return (
                      <Link href={`/dashboard/campaigns/${campaign.id}`} key={campaign.id}>
                        <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                          <div className="relative h-40">
                            <Image
                              src={campaign.imageEndpoint || "/placeholder.svg"}
                              alt={campaign.title}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                // Fallback if image fails to load
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                            <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium mb-1">{campaign.title}</h3>
                            <p className="text-xs text-muted-foreground">
                              {campaign.category || "General"} • Ends: {campaign.endDate
                                ? new Date(campaign.endDate).toLocaleDateString()
                                : "No end date"}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  }).filter(Boolean)}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No available campaigns found</p>
                  <Link href="/dashboard/explore">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Explore Campaigns
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Top Categories</CardTitle>
              <CardDescription>Campaigns by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <StatisticsSidebar />
    </div>
  )
} 