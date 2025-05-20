"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { messageService } from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface MessageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipientId: string
  recipientName: string
  onSuccess?: () => void
}

export function MessageDialog({ 
  open, 
  onOpenChange, 
  recipientId, 
  recipientName,
  onSuccess 
}: MessageDialogProps) {
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSendMessage = async () => {
    if (!message.trim()) return

    try {
      setSending(true)
      
      // Create a new conversation with the initial message
      const response = await messageService.createConversation(recipientId, message)
      console.log("New conversation created:", response.data)
      
      // Success toast
      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${recipientName}.`,
      })
      
      // Reset form
      setMessage("")
      
      // Close dialog
      onOpenChange(false)
      
      // Navigate to messages page or callback
      if (onSuccess) {
        onSuccess()
      } else {
        // Navigate to messages page after a delay
        setTimeout(() => {
          router.push("/dashboard/messages")
        }, 500)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Message to {recipientName}</DialogTitle>
          <DialogDescription>
            Start a conversation with this creator about your campaign opportunities.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={sending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage} 
            disabled={!message.trim() || sending}
          >
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 