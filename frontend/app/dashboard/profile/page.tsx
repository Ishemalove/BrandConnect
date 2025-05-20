"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Pencil, Save, Instagram, Twitter, Youtube, Globe } from "lucide-react"
import { jsPDF } from "jspdf"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "",
    website: "",
    companyName: "",
    categories: ["Fashion", "Technology"],
    platforms: ["Instagram", "TikTok"],
    socialLinks: {
      instagram: "https://instagram.com/username",
      twitter: "https://twitter.com/username",
      youtube: "https://youtube.com/channel",
      website: "https://example.com",
    },
  })

  const isBrand = user?.role === "brand"

  const handleSave = () => {
    // In a real app, you would save this data to your backend
    setIsEditing(false)
  }

  const handleDownloadProfile = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text("Profile Information", 10, 10)
    doc.setFontSize(12)
    doc.text(`Full Name: ${profileData.name}`, 10, 30)
    doc.text(`Email: ${profileData.email}`, 10, 40)
    doc.text(`Role: ${isBrand ? "Brand" : "Creator"}`, 10, 50)
    if (!isBrand) {
      doc.text(`Instagram: ${profileData.socialLinks.instagram || "-"}`, 10, 60)
      doc.text(`Twitter: ${profileData.socialLinks.twitter || "-"}`, 10, 70)
      doc.text(`YouTube: ${profileData.socialLinks.youtube || "-"}`, 10, 80)
      doc.text(`Website: ${profileData.socialLinks.website || "-"}`, 10, 90)
    } else {
      doc.text(`Website: ${profileData.website || "-"}`, 10, 60)
      doc.text(`Company Name: ${profileData.companyName || "-"}`, 10, 70)
    }
    doc.text(`Bio: ${profileData.bio || "-"}`, 10, 100)
    doc.save("profile.pdf")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <div className="flex gap-2">
        <Button onClick={isEditing ? handleSave : () => setIsEditing(true)}>
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
          <Button variant="outline" onClick={handleDownloadProfile}>
            Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src="/placeholder.svg?height=128&width=128" alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <Badge className="mt-2">{isBrand ? "Brand" : "Creator"}</Badge>

              {!isEditing ? (
                <div className="w-full mt-6 space-y-2">
                  {isBrand ? (
                    <>
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a
                          href={profileData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                        >
                          {profileData.website || "Add website"}
                        </a>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <Instagram className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a
                          href={profileData.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                        >
                          Instagram
                        </a>
                      </div>
                      <div className="flex items-center">
                        <Twitter className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a
                          href={profileData.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                        >
                          Twitter
                        </a>
                      </div>
                      <div className="flex items-center">
                        <Youtube className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a
                          href={profileData.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                        >
                          YouTube
                        </a>
                      </div>
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a
                          href={profileData.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                        >
                          Website
                        </a>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full mt-6 space-y-4">
                  {isBrand ? (
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        placeholder="https://yourbrand.com"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          value={profileData.socialLinks.instagram}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              socialLinks: { ...profileData.socialLinks, instagram: e.target.value },
                            })
                          }
                          placeholder="https://instagram.com/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input
                          id="twitter"
                          value={profileData.socialLinks.twitter}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              socialLinks: { ...profileData.socialLinks, twitter: e.target.value },
                            })
                          }
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="youtube">YouTube</Label>
                        <Input
                          id="youtube"
                          value={profileData.socialLinks.youtube}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              socialLinks: { ...profileData.socialLinks, youtube: e.target.value },
                            })
                          }
                          placeholder="https://youtube.com/channel"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={profileData.socialLinks.website}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              socialLinks: { ...profileData.socialLinks, website: e.target.value },
                            })
                          }
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="info" className="space-y-4">
            <TabsList>
              <TabsTrigger value="info">Basic Info</TabsTrigger>
              {isBrand ? (
                <TabsTrigger value="company">Company Details</TabsTrigger>
              ) : (
                <TabsTrigger value="interests">Interests & Skills</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {isBrand ? (
              <TabsContent value="company">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Details</CardTitle>
                    <CardDescription>Information about your brand</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={profileData.companyName}
                        onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Industries</Label>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Fashion & Apparel</Badge>
                        <Badge variant="outline">Technology</Badge>
                        <Badge variant="outline">Food & Beverage</Badge>
                        {isEditing && (
                          <Button variant="outline" size="sm" className="h-6">
                            + Add
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ) : (
              <TabsContent value="interests">
                <Card>
                  <CardHeader>
                    <CardTitle>Interests & Skills</CardTitle>
                    <CardDescription>What type of content do you create?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Content Categories</Label>
                      <div className="flex flex-wrap gap-2">
                        {profileData.categories.map((category) => (
                          <Badge key={category} variant="outline">
                            {category}
                          </Badge>
                        ))}
                        {isEditing && (
                          <Button variant="outline" size="sm" className="h-6">
                            + Add
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Platforms</Label>
                      <div className="flex flex-wrap gap-2">
                        {profileData.platforms.map((platform) => (
                          <Badge key={platform} variant="outline">
                            {platform}
                          </Badge>
                        ))}
                        {isEditing && (
                          <Button variant="outline" size="sm" className="h-6">
                            + Add
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
