import * as React from "react"
import { Eye } from "lucide-react"
import { Toast } from "@/components/ui/toast"
import { ToastTitle, ToastDescription } from "@/components/ui/toast"

interface ProfileViewToastProps {
  creatorName?: string
}

export function ProfileViewToast({ creatorName = "creator" }: ProfileViewToastProps) {
  return (
    <Toast>
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
          <Eye className="h-4 w-4 text-primary" />
        </div>
        <div>
          <ToastTitle>Profile View Tracked</ToastTitle>
          <ToastDescription>
            Your view of {creatorName}'s profile has been recorded.
          </ToastDescription>
        </div>
      </div>
    </Toast>
  )
} 