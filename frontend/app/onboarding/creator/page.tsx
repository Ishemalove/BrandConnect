"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { BrandConnectLogo } from "@/components/brand-connect-logo"
import { useAuth } from "@/components/auth-provider"

const categories = [
  "Fashion",
  "Beauty",
  "Technology",
  "Gaming",
  "Food",
  "Travel",
  "Fitness",
  "Lifestyle",
  "Home",
  "Parenting",
  "Business",
  "Education",
]

const platforms = ["Instagram", "TikTok", "YouTube", "Twitter", "Facebook", "Pinterest", "Twitch", "LinkedIn", "Blog"]

export default function CreatorOnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [bio, setBio] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    tiktok: "",
    youtube: "",
    other: "",
  })

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]))
  }

  const handleSocialLinkChange = (platform: keyof typeof socialLinks, value: string) => {
    setSocialLinks((prev) => ({
      ...prev,
      [platform]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save this data to your backend
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-secondary/30 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <BrandConnectLogo className="h-12 w-12 mx-auto" />
            <h1 className="mt-4 text-3xl font-bold">Complete Your Creator Profile</h1>
            <p className="text-muted-foreground mt-2">
              Help brands discover you by sharing your interests and expertise
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About You</CardTitle>
                  <CardDescription>Tell brands about yourself and your content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Share a bit about yourself, your content style, and what makes you unique..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Categories</CardTitle>
                  <CardDescription>
                    Select the categories that best describe your content (select up to 5)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryToggle(category)}
                          disabled={selectedCategories.length >= 5 && !selectedCategories.includes(category)}
                        />
                        <Label htmlFor={`category-${category}`} className="cursor-pointer">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platforms</CardTitle>
                  <CardDescription>Select the platforms where you create content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {platforms.map((platform) => (
                      <div key={platform} className="flex items-center space-x-2">
                        <Checkbox
                          id={`platform-${platform}`}
                          checked={selectedPlatforms.includes(platform)}
                          onCheckedChange={() => handlePlatformToggle(platform)}
                        />
                        <Label htmlFor={`platform-${platform}`} className="cursor-pointer">
                          {platform}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram Username</Label>
                      <Input
                        id="instagram"
                        placeholder="@username"
                        value={socialLinks.instagram}
                        onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tiktok">TikTok Username</Label>
                      <Input
                        id="tiktok"
                        placeholder="@username"
                        value={socialLinks.tiktok}
                        onChange={(e) => handleSocialLinkChange("tiktok", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="youtube">YouTube Channel</Label>
                      <Input
                        id="youtube"
                        placeholder="Channel name or URL"
                        value={socialLinks.youtube}
                        onChange={(e) => handleSocialLinkChange("youtube", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="other">Other Platform/Website</Label>
                      <Input
                        id="other"
                        placeholder="URL"
                        value={socialLinks.other}
                        onChange={(e) => handleSocialLinkChange("other", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardFooter className="flex justify-between pt-6">
                  <Button variant="outline" type="button" onClick={() => router.push("/dashboard")}>
                    Skip for Now
                  </Button>
                  <Button type="submit">Complete Profile</Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
