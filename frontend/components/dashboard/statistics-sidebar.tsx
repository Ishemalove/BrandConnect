"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, Users, Heart, Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { statisticsService } from "@/lib/api-service"
import { Skeleton } from "@/components/ui/skeleton"

interface StatsData {
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
}

export function StatisticsSidebar() {
  const { user } = useAuth()
  const isBrand = user?.role === "BRAND"
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const data = await statisticsService.getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error("Failed to load statistics:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user])

  const getTopCategories = () => {
    if (!stats?.categoryDistribution) return [];
    
    return Object.entries(stats.categoryDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, count]) => {
        const total = Object.values(stats.categoryDistribution!).reduce((sum, val) => sum + val, 0);
        const percentage = Math.round((count / total) * 100);
        return { category, percentage };
      });
  }

  const topCategories = getTopCategories();

  if (loading) {
    return (
      <aside className="stats-sidebar border-l border-border p-4 hidden lg:block">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Statistics</h3>
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </aside>
    )
  }

  return (
    <aside className="stats-sidebar border-l border-border p-4 hidden lg:block">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Statistics</h3>

        {isBrand ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  Interested Creators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeCreators || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.creatorsChange && stats.creatorsChange > 0 ? "+" : ""}
                  {stats?.creatorsChange || 0} from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                  Total Campaigns
                </CardTitle>
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
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                  Engagement Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.engagementRate || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.engagementChange && stats.engagementChange > 0 ? "+" : ""}
                  {stats?.engagementChange || 0}% from last month
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-primary" />
                  Saved Campaigns
                </CardTitle>
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
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-primary" />
                  Applications Sent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.applicationsSent || 0}</div>
                <p className="text-xs text-muted-foreground">{stats?.pendingApplications || 0} pending responses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                  Profile Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.profileViews || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.profileViewsChange && stats.profileViewsChange > 0 ? "+" : ""}
                  {stats?.profileViewsChange || 0}% from last week
                </p>
              </CardContent>
            </Card>
          </>
        )}

        <div className="pt-4 border-t border-border">
          <h4 className="font-medium text-sm mb-3">Top Categories</h4>
          <div className="space-y-2">
            {topCategories.length > 0 ? (
              topCategories.map(({ category, percentage }) => (
                <div key={category}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{category}</span>
                    <span className="text-xs font-medium">{percentage}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Fashion</span>
                  <span className="text-xs font-medium">32%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: "32%" }}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Technology</span>
                  <span className="text-xs font-medium">28%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: "28%" }}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Food & Beverage</span>
                  <span className="text-xs font-medium">18%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: "18%" }}></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
