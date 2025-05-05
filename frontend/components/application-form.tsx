"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { applicationService } from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

// Define application form schema
const applicationFormSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters").max(500, "Message must not exceed 500 characters"),
  instagramHandle: z.string().optional(),
  twitterHandle: z.string().optional(),
  youtubeChannel: z.string().optional(),
  tiktokHandle: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
})

type ApplicationFormValues = z.infer<typeof applicationFormSchema>

interface ApplicationFormProps {
  campaignId: string | number
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function ApplicationForm({ campaignId, isOpen, onClose, onSuccess }: ApplicationFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with default values
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      message: "",
      instagramHandle: user?.instagramHandle || "",
      twitterHandle: user?.twitterHandle || "",
      youtubeChannel: user?.youtubeChannel || "",
      tiktokHandle: user?.tiktokHandle || "",
      website: user?.website || "",
    },
  })

  const onSubmit = async (values: ApplicationFormValues) => {
    try {
      setIsSubmitting(true)
      
      // Prepare application data
      const applicationData = {
        campaignId: String(campaignId),
        message: values.message,
        socialMedia: {
          instagramHandle: values.instagramHandle,
          twitterHandle: values.twitterHandle,
          youtubeChannel: values.youtubeChannel,
          tiktokHandle: values.tiktokHandle,
          website: values.website,
        }
      }
      
      console.log("Submitting application:", applicationData)
      
      // Submit application
      const response = await applicationService.createApplication(applicationData)
      
      // Show success toast
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted. You can check its status in the Applications tab.",
      })
      
      // Close form
      onClose()
      
      // Optional success callback
      if (onSuccess) {
        onSuccess()
      }
      
      // Navigate to applications page
      router.push("/dashboard/applications")
    } catch (error: any) {
      console.error("Error submitting application:", error)
      
      // Show error toast with custom message if available
      toast({
        title: "Application Failed",
        description: error.userMessage || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Apply for Campaign</DialogTitle>
          <DialogDescription>
            Provide your social media details and a message to the brand explaining why you're a good fit for this campaign.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message to Brand</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain why you are a good fit for this campaign and what you can offer..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Social Media Profiles</h3>
              
              <FormField
                control={form.control}
                name="instagramHandle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram Handle</FormLabel>
                    <FormControl>
                      <Input placeholder="@username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="twitterHandle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Handle</FormLabel>
                    <FormControl>
                      <Input placeholder="@username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tiktokHandle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TikTok Username</FormLabel>
                    <FormControl>
                      <Input placeholder="@username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="youtubeChannel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube Channel</FormLabel>
                    <FormControl>
                      <Input placeholder="Channel URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourwebsite.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Application
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 