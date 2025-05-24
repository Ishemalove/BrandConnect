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
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

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

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  startDate: z.date({
    required_error: "A start date is required.",
  }),
  endDate: z.date().optional(),
  requirements: z.string().min(1, "Requirements are required"),
})

type FormValues = z.infer<typeof formSchema>

export default function NewCampaignPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      startDate: new Date(),
      endDate: undefined,
      requirements: "",
    },
  })

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function onSubmit(values: FormValues) {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a campaign",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setError("")

    try {
      // 1. Create the campaign
      const campaignData = {
        title: values.title,
        description: values.description,
        category: values.category,
        startDate: values.startDate.toISOString().split('T')[0],
        endDate: values.endDate?.toISOString().split('T')[0],
        requirements: values.requirements,
        campaignType: "post", // Default to post type
      }

      console.log("Creating campaign with data:", campaignData)
      const response = await campaignService.createCampaign(campaignData)
      console.log("Campaign creation response:", response)

      if (!response.data || !response.data.id) {
        throw new Error("Failed to create campaign: No campaign ID returned")
      }

      // 2. If a file was selected, upload it
      if (selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)

        try {
          // First try to upload the image
          const uploadResponse = await fetch(`/api/campaigns/${response.data.id}/image`, {
            method: 'POST',
            body: formData,
          })

          if (!uploadResponse.ok) {
            throw new Error('Failed to upload image')
          }

          console.log("Image uploaded successfully")
        } catch (imageUploadError) {
          console.error("Error uploading image:", imageUploadError)
          toast({
            title: "Image Upload Failed",
            description: "The campaign was created, but the image could not be uploaded. You can try adding it later.",
            variant: "default",
          })
        }
      }

      toast({
        title: "Success",
        description: "Campaign created successfully",
      })

      router.push(`/dashboard/campaigns/${response.data.id}`)
    } catch (err: any) {
      console.error("Error creating campaign:", err)
      setError(err.message || "Failed to create campaign")
      toast({
        title: "Error",
        description: err.message || "Failed to create campaign. Please try again.",
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Basic information about your campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Summer Fashion Collection 2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Description</FormLabel>
                    <FormControl>
                <Textarea
                  placeholder="Describe your campaign, goals, and what you're looking for..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                              checked={field.value === category}
                              onCheckedChange={() => field.onChange(category)}
                      />
                      <Label htmlFor={`category-${category}`} className="cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Define when your campaign will run</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                        )}
                      >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                        </FormControl>
                    </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                        )}
                      >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                        </FormControl>
                    </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                    </PopoverContent>
                  </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>Specify what you need from creators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Creator Requirements</FormLabel>
                    <FormControl>
                <Textarea
                  placeholder="e.g., Minimum follower count, specific niche, location, etc."
                        {...field}
                />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Campaign"}
            </Button>
        </div>
      </form>
      </Form>
    </div>
  )
}
