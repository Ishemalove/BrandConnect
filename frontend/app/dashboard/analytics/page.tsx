"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart, Loader2 } from "lucide-react"
import { statisticsService } from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days")
  const [stats, setStats] = useState({
    totalCampaigns: { value: 0, change: 0 },
    activeCreators: { value: 0, change: 0 },
    totalReach: { value: '0', change: 0 },
    roi: { value: 0, change: 0 }
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  
  // Fetch statistics from the backend
  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true)
        
        // Get stats based on user role
        const dashboardStats = await statisticsService.getDashboardStats()
        console.log("Dashboard stats:", dashboardStats)
        
        // Get brand-specific stats if available
        const brandStats = await statisticsService.getBrandStats()
        console.log("Brand stats:", brandStats)
        
        // Get performance stats
        const performanceStats = await statisticsService.getPerformanceStats()
        console.log("Performance stats:", performanceStats)
        
        // Update state with fetched data
        if (dashboardStats || brandStats || performanceStats) {
          // Prioritize brand stats if available, fall back to dashboard stats
          const data = brandStats || dashboardStats || performanceStats || {}
          
          setStats({
            totalCampaigns: {
              value: data.totalCampaigns || data.activeCampaigns?.total || 0,
              change: data.campaignsChange || data.activeCampaigns?.change || 0
            },
            activeCreators: {
              value: data.activeCreators || 0,
              change: data.creatorsChange || 0
            },
            totalReach: {
              value: formatLargeNumber(data.totalReach || data.profileViews?.total || 0),
              change: data.reachChange || data.profileViews?.change || 0
            },
            roi: {
              value: data.roi || 0,
              change: data.roiChange || 0
            }
          })
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error)
        toast({
          title: "Error",
          description: "Failed to load analytics data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchAnalytics()
  }, [timeRange, toast])
  
  // Helper function to format large numbers
  function formatLargeNumber(number: number): string {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M'
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K'
    }
    return number.toString()
  }
  
  // Helper function to format percentage
  function formatPercentage(value: number | string | undefined): string {
    if (typeof value === 'number') {
      return value >= 0 ? `+${value}%` : `${value}%`
    }
    return value ? `${value}%` : '0%'
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-muted-foreground">Loading analytics data...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <Select defaultValue={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCampaigns.value}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalCampaigns.change >= 0 ? '+' : ''}{stats.totalCampaigns.change} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Creators</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCreators.value}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeCreators.change >= 0 ? '+' : ''}{stats.activeCreators.change}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReach.value}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalReach.change >= 0 ? '+' : ''}{stats.totalReach.change}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(stats.roi.value)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.roi.change >= 0 ? '+' : ''}{stats.roi.change}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview" className="flex items-center">
            <LineChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="demographics" className="flex items-center">
            <PieChart className="h-4 w-4 mr-2" />
            Demographics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>View the performance of your campaigns over the selected time period.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-muted/20">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Campaign Performance Chart</p>
                <p className="text-xs text-muted-foreground">(Chart visualization would be here)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Metrics</CardTitle>
              <CardDescription>Compare the performance metrics across different campaigns.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-muted/20">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Campaign Metrics Chart</p>
                <p className="text-xs text-muted-foreground">(Chart visualization would be here)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audience Demographics</CardTitle>
              <CardDescription>Understand the demographics of your audience across campaigns.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-muted/20">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Demographics Chart</p>
                <p className="text-xs text-muted-foreground">(Chart visualization would be here)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
