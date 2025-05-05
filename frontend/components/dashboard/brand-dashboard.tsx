"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatisticsSidebar } from "@/components/dashboard/statistics-sidebar"
import { CampaignList } from "@/components/dashboard/campaign-list"
import { ApplicationsList } from "@/components/dashboard/applications-list"
import { useAuth } from "@/components/auth-provider"
import { BarChart, ChevronRight, PlusCircle, Users, LucideBarChart, Lightbulb, TrendingUp } from "lucide-react"
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
  Cell,
} from "recharts"

// Sample data for charts
const campaignPerformanceData = [
  { name: "Summer Collection", views: 2500, applications: 42, engagement: 3.2 },
  { name: "Tech Review", views: 1800, applications: 28, engagement: 2.7 },
  { name: "Food Blog", views: 3200, applications: 64, engagement: 4.1 },
  { name: "Travel Vlog", views: 2100, applications: 35, engagement: 3.0 },
]

const creatorCategoryData = [
  { name: "Fashion", value: 40 },
  { name: "Tech", value: 25 },
  { name: "Food", value: 15 },
  { name: "Travel", value: 20 },
]

const COLORS = ["#ea4c89", "#38bdf8", "#4ade80", "#f97316"]

// Featured creators with real images
const featuredCreators = [
  {
    id: "1",
    name: "Sophia Williams",
    role: "Fashion Influencer",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    followers: "245K",
    engagement: "4.8%",
  },
  {
    id: "2",
    name: "James Chen",
    role: "Tech Reviewer",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop",
    followers: "1.2M",
    engagement: "3.5%",
  },
  {
    id: "3",
    name: "Maya Rodriguez",
    role: "Food Blogger",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    followers: "578K",
    engagement: "5.2%",
  },
]

// Sample campaign cards
const recentCampaigns = [
  {
    id: "1",
    title: "Summer Fashion Collection",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop",
    applications: 42,
    status: "Active",
    endDate: "June 30, 2023",
  },
  {
    id: "2",
    title: "Tech Gadget Review",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop",
    applications: 28,
    status: "Active",
    endDate: "July 15, 2023",
  },
  {
    id: "3",
    title: "Healthy Meal Prep",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop",
    applications: 64,
    status: "Completed",
    endDate: "May 20, 2023",
  },
]

export function BrandDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || "Brand"}!</h1>
              <p className="text-muted-foreground">Here's what's happening with your campaigns today.</p>
            </div>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Creators</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">+201 since last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2%</div>
                  <p className="text-xs text-muted-foreground">+0.5% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                  <CardDescription>Views and applications per campaign</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={campaignPerformanceData}
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
                          data={creatorCategoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {creatorCategoryData.map((entry, index) => (
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

            <div className="grid gap-4 grid-cols-1 md:grid-cols-12">
              <Card className="col-span-12 md:col-span-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Campaigns</CardTitle>
                    <Link href="/dashboard/brand/campaigns">
                      <Button variant="ghost" className="gap-1">
                        View All
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {recentCampaigns.map((campaign) => (
                      <Link href={`/dashboard/campaigns/${campaign.id}`} key={campaign.id}>
                        <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                          <div className="relative h-40">
                            <Image
                              src={campaign.image || "/placeholder.svg"}
                              alt={campaign.title}
                              fill
                              className="object-cover"
                              priority
                            />
                            <div
                              className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                                campaign.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {campaign.status}
                            </div>
                          </div>
                          <CardContent className="p-3">
                            <h3 className="font-medium line-clamp-1">{campaign.title}</h3>
                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                              <span>{campaign.applications} Applications</span>
                              <span>Ends: {campaign.endDate}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-12 md:col-span-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Featured Creators</CardTitle>
                    <Link href="/dashboard/brand/creators">
                      <Button variant="ghost" className="gap-1">
                        View All
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {featuredCreators.map((creator) => (
                      <div key={creator.id} className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden">
                          <Image
                            src={creator.image || "/placeholder.svg"}
                            alt={creator.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{creator.name}</p>
                          <p className="text-xs text-muted-foreground">{creator.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{creator.followers}</p>
                          <p className="text-xs text-muted-foreground">{creator.engagement} Eng.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Tips</CardTitle>
                <CardDescription>Maximize your campaign's reach and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="border rounded-lg p-4 flex flex-col">
                    <div className="bg-pink-100 self-start p-2 rounded-full mb-3">
                      <Lightbulb className="h-4 w-4 text-pink-600" />
                    </div>
                    <h3 className="font-medium mb-1">Clear Deliverables</h3>
                    <p className="text-sm text-muted-foreground">
                      Specify exactly what content you expect creators to produce to avoid misunderstandings.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 flex flex-col">
                    <div className="bg-blue-100 self-start p-2 rounded-full mb-3">
                      <LucideBarChart className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="font-medium mb-1">Engagement First</h3>
                    <p className="text-sm text-muted-foreground">
                      Focus on creators with high engagement rates rather than just follower count.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 flex flex-col">
                    <div className="bg-green-100 self-start p-2 rounded-full mb-3">
                      <PlusCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <h3 className="font-medium mb-1">Creative Freedom</h3>
                    <p className="text-sm text-muted-foreground">
                      Allow creators some creative flexibility to produce more authentic content.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/resources/campaign-guide">
                  <Button variant="outline">Read Full Campaign Guide</Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Campaigns</CardTitle>
                  <Link href="/dashboard/campaigns/new">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Campaign
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <CampaignList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <ApplicationsList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <StatisticsSidebar />
    </div>
  )
}
