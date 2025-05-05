"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Users, Eye, DollarSign, BarChart3 } from "lucide-react"
import { statisticsService } from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"

// Default placeholder data
const defaultPerformance = {
  profileViews: { total: 0, change: 0 },
  campaignsApplied: { total: 0, change: 0 },
  acceptanceRate: { total: 0, change: 0 },
  earnings: { total: 0, change: 0 },
  campaignViews: { total: 0, change: 0 },
  applications: { total: 0, change: 0 },
  conversionRate: { total: 0, change: 0 },
  activeCampaigns: { total: 0, change: 0 }
}

export default function PerformancePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const isBrand = user?.role === "BRAND"
  const [performance, setPerformance] = useState(defaultPerformance)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await statisticsService.getPerformanceStats()
        if (response) {
          setPerformance({
            ...defaultPerformance,
            ...response
          })
        }
      } catch (error) {
        console.error("Error fetching performance data:", error)
        toast({
          title: "Error",
          description: "Failed to load performance analytics. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchAnalytics()
  }, [toast])

  // Loading skeletons
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
          <p className="text-muted-foreground">
            Track your {isBrand ? "campaign" : "creator"} performance and analytics
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 w-32 bg-muted rounded animate-pulse mb-1" />
                <div className="h-3 w-40 bg-muted rounded animate-pulse opacity-70" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 w-24 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
        <p className="text-muted-foreground">
          Track your {isBrand ? "campaign" : "creator"} performance and analytics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isBrand ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Campaign Views</CardTitle>
                <CardDescription>Total views across all campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{performance.campaignViews.total.toLocaleString()}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {performance.campaignViews.change > 0 ? (
                        <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 mr-1 text-red-500" />
                      )}
                      <span className={performance.campaignViews.change > 0 ? "text-green-500" : "text-red-500"}>
                        {performance.campaignViews.change}%
                      </span>
                      <span className="ml-1">from last month</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <CardDescription>Total applications received</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{performance.applications.total}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {performance.applications.change > 0 ? (
                        <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 mr-1 text-red-500" />
                      )}
                      <span className={performance.applications.change > 0 ? "text-green-500" : "text-red-500"}>
                        {performance.applications.change}%
                      </span>
                      <span className="ml-1">from last month</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <CardDescription>Views to applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{performance.conversionRate.total}%</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {performance.conversionRate.change > 0 ? (
                        <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 mr-1 text-red-500" />
                      )}
                      <span className={performance.conversionRate.change > 0 ? "text-green-500" : "text-red-500"}>
                        {performance.conversionRate.change}%
                      </span>
                      <span className="ml-1">from last month</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                <CardDescription>Currently running campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{performance.activeCampaigns.total}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {performance.activeCampaigns.change > 0 ? (
                        <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 mr-1 text-red-500" />
                      )}
                      <span className={performance.activeCampaigns.change > 0 ? "text-green-500" : "text-red-500"}>
                        +{performance.activeCampaigns.change}
                      </span>
                      <span className="ml-1">from last month</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                <CardDescription>Total views on your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{performance.profileViews.total.toLocaleString()}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {performance.profileViews.change > 0 ? (
                        <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 mr-1 text-red-500" />
                      )}
                      <span className={performance.profileViews.change > 0 ? "text-green-500" : "text-red-500"}>
                        {performance.profileViews.change}%
                      </span>
                      <span className="ml-1">from last month</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Campaigns Applied</CardTitle>
                <CardDescription>Total applications sent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{performance.campaignsApplied.total}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {performance.campaignsApplied.change > 0 ? (
                        <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 mr-1 text-red-500" />
                      )}
                      <span className={performance.campaignsApplied.change > 0 ? "text-green-500" : "text-red-500"}>
                        {performance.campaignsApplied.change}%
                      </span>
                      <span className="ml-1">from last month</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
                <CardDescription>Applications accepted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{performance.acceptanceRate.total}%</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {performance.acceptanceRate.change > 0 ? (
                        <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 mr-1 text-red-500" />
                      )}
                      <span className={performance.acceptanceRate.change > 0 ? "text-green-500" : "text-red-500"}>
                        {performance.acceptanceRate.change}%
                      </span>
                      <span className="ml-1">from last month</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <CardDescription>Revenue from campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">${performance.earnings.total}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {performance.earnings.change > 0 ? (
                        <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 mr-1 text-red-500" />
                      )}
                      <span className={performance.earnings.change > 0 ? "text-green-500" : "text-red-500"}>
                        {performance.earnings.change}%
                      </span>
                      <span className="ml-1">from last month</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Campaign History</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Views Over Time</CardTitle>
              <CardDescription>
                Total views of your {isBrand ? "campaign" : "creator"} profile
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {/* Chart will be implemented in the future */}
              <div className="flex items-center justify-center h-full bg-secondary/20 rounded-md">
                <p className="text-muted-foreground">Profile view analytics chart will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
              <CardTitle>Campaign History</CardTitle>
                <CardDescription>
                Your {isBrand ? "published campaigns" : "application"} history
                </CardDescription>
              </CardHeader>
            <CardContent className="h-80">
              {/* History chart will be implemented in the future */}
              <div className="flex items-center justify-center h-full bg-secondary/20 rounded-md">
                <p className="text-muted-foreground">Campaign history graph will appear here</p>
              </div>
            </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>
                How {isBrand ? "creators engage with your campaigns" : "brands respond to your applications"}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {/* Engagement chart will be implemented in the future */}
              <div className="flex items-center justify-center h-full bg-secondary/20 rounded-md">
                <p className="text-muted-foreground">Engagement metrics chart will appear here</p>
          </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
