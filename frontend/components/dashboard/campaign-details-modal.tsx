"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageSquare, Eye, Clock, Send, X } from "lucide-react"
import { ApplicationForm } from "@/components/application-form"

interface CampaignDetailsModalProps {
  campaign: {
    id: string
    title: string
    brand: string
    brandLogo: string
    image: string
    category: string
    likes: number
    views: number
    comments: number
    isAvailable: boolean
    timeLeft: string
    description: string
  }
  isOpen: boolean
  onClose: () => void
  isLiked: boolean
  onLike: () => void
}

export function CampaignDetailsModal({ campaign, isOpen, onClose, isLiked, onLike }: CampaignDetailsModalProps) {
  const [comment, setComment] = useState("")
  const [hasApplied, setHasApplied] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  const handleApply = () => {
    setShowApplicationForm(true)
  }

  const handleApplicationSuccess = () => {
    setHasApplied(true)
    setShowApplicationForm(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="relative h-64 md:h-80">
              <Image src={campaign.image || "/placeholder.svg"} alt={campaign.title} fill className="object-cover" />
              {campaign.isAvailable && (
                <div className="absolute top-4 left-4 bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-md">
                  Available for Work
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black/70 text-white text-sm font-medium px-3 py-1 rounded-md flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {campaign.timeLeft} left
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <DialogTitle className="text-2xl font-bold mb-2">{campaign.title}</DialogTitle>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={campaign.brandLogo || "/placeholder.svg"} alt={campaign.brand} />
                    <AvatarFallback>{campaign.brand[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{campaign.brand}</div>
                    <div className="text-sm text-muted-foreground">Brand</div>
                  </div>
                </div>
              </div>
              <Badge variant="outline">{campaign.category}</Badge>
            </div>

            <div className="flex gap-4 mb-6">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={onLike}
                className={isLiked ? "bg-primary text-primary-foreground" : ""}
              >
                <Heart className="h-4 w-4 mr-2" />
                {isLiked ? "Liked" : "Like"}
              </Button>
              {campaign.isAvailable && !hasApplied && (
                <Button size="sm" onClick={handleApply}>
                  Apply for Campaign
                </Button>
              )}
              {hasApplied && (
                <Button size="sm" variant="outline" disabled>
                  Application Sent
                </Button>
              )}
            </div>

            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="comments">Comments ({campaign.comments})</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Campaign Description</h3>
                    <p className="text-muted-foreground">{campaign.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      <li>Minimum 10k followers on Instagram or TikTok</li>
                      <li>Previous experience with similar brands</li>
                      <li>Ability to create high-quality content</li>
                      <li>Available for content creation in the next 2 weeks</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Deliverables</h3>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      <li>2 Instagram posts</li>
                      <li>3 Instagram stories</li>
                      <li>1 TikTok video</li>
                    </ul>
                  </div>

                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {campaign.likes} likes
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {campaign.views}k views
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {campaign.comments} comments
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comments">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <Button size="sm" disabled={!comment.trim()}>
                          <Send className="h-4 w-4 mr-2" />
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=40&auto=format&fit=crop" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">Jane Doe</span>
                          <span className="text-xs text-muted-foreground ml-2">2 days ago</span>
                        </div>
                        <p className="text-muted-foreground mt-1">
                          This campaign looks amazing! I've worked with similar brands before and would love to
                          collaborate.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=40&auto=format&fit=crop" />
                        <AvatarFallback>MS</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">Mike Smith</span>
                          <span className="text-xs text-muted-foreground ml-2">1 day ago</span>
                        </div>
                        <p className="text-muted-foreground mt-1">
                          What's the budget range for this campaign? Would be helpful to know before applying.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Application Form Dialog */}
      {showApplicationForm && (
        <ApplicationForm 
          campaignId={campaign.id}
          isOpen={showApplicationForm}
          onClose={() => setShowApplicationForm(false)}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </>
  )
}
