"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { campaignService } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"
import { useToast } from "@/components/ui/use-toast"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { z } from "zod"

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

export default function NewCampaignPage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [requirements, setRequirements] = useState("")
  const [deliverables, setDeliverables] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [campaignType, setCampaignType] = useState<string>("post")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>("")

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const previewUrl = await campaignService.uploadImagePreview(file)
      setImagePreview(previewUrl)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return
    setLoading(true)
    setError("")
    try {
      // 1. Create the campaign first (without the image data in the initial payload)
      const campaignData = {
        title: values.title,
        description: values.description,
        category: values.category,
        startDate: values.startDate.toISOString().split('T')[0],
        endDate: values.endDate?.toISOString().split('T')[0],
        requirements: values.requirements,
        // Do NOT include imageUrl or deliverables here, they are handled separately
        campaignType: campaignType,
      }

      const createdCampaignResponse = await campaignService.createCampaign(campaignData)
      const createdCampaign = createdCampaignResponse.data

      // 2. If a file was selected, upload it using the dedicated endpoint
      if (selectedFile && createdCampaign?.id) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
          await campaignService.uploadCampaignImage(createdCampaign.id.toString(), formData);
          console.log("Image uploaded successfully for campaign ID:", createdCampaign.id);
        } catch (imageUploadError) {
          console.error("Error uploading image:", imageUploadError);
          // Decide how to handle image upload failure (e.g., show a warning, or rollback campaign creation)
          // For now, we'll just log the error and let the campaign be created without the image.
          toast({
            title: "Image Upload Failed",
            description: "The campaign was created, but the image could not be uploaded. You can try adding it later.",
            variant: "warning",
          });
        }
      }

      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully.",
      })
      router.push(`/dashboard/campaigns/${createdCampaign.id}`)
    } catch (err: any) {
      console.error("Error creating campaign:", err)
      setError(err.message || "Failed to create campaign")
      toast({
        title: "Error",
        description: err.userMessage || "Failed to create campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Campaign</h1>
        <p className="text-muted-foreground mt-2">Fill in the details below to create a new marketing campaign</p>
      </div>

      <form onSubmit={onSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Basic information about your campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Summer Fashion Collection 2023"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Campaign Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your campaign, goals, and what you're looking for..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategory === category}
                        onCheckedChange={() => setSelectedCategory(category)}
                      />
                      <Label htmlFor={`category-${category}`} className="cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Type & Timeline</CardTitle>
              <CardDescription>Define what type of content you need and when</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Campaign Type</Label>
                <RadioGroup
                  value={campaignType}
                  onValueChange={setCampaignType}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="post" id="post" />
                    <Label htmlFor="post" className="cursor-pointer">
                      Social Media Posts
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="video" id="video" />
                    <Label htmlFor="video" className="cursor-pointer">
                      Video Content
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="review" id="review" />
                    <Label htmlFor="review" className="cursor-pointer">
                      Product Reviews
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} className="rounded-md border" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements & Deliverables</CardTitle>
              <CardDescription>Specify what you need from creators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requirements">Creator Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="e.g., Minimum follower count, specific niche, location, etc."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliverables">Expected Deliverables</Label>
                <Textarea
                  id="deliverables"
                  placeholder="e.g., 2 Instagram posts, 3 TikTok videos, etc."
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Campaign Image</Label>
                <Input type="file" accept="image/*" onChange={handleImageChange} className="mt-2" />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-2 max-h-48 rounded" />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.push("/dashboard/campaigns")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Campaign"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
