"use client"

import { useState } from "react"
import { ApplicationsList } from "@/components/dashboard/applications-list"
import { Button } from "@/components/ui/button"

export default function ApplicationsPage() {
  const [debug, setDebug] = useState(false)
  
  // Hard-coded application data for direct testing
  const debugApplications = [
    {
      id: 1,
      appliedAt: "2025-05-05 08:30:52.410468",
      status: "PENDING",
      campaign_id: 3,
      creator_id: 12,
      campaign: {
        id: 3,
        title: "Debug Campaign 3",
        description: "This is a debug campaign to test display",
        imageUrl: "/placeholder.svg",
        category: "Debug",
        brand: {
          id: 1,
          name: "Debug Brand",
          logo: "/placeholder.svg"
        }
      }
    },
    {
      id: 2,
      appliedAt: "2025-05-05 11:10:34.067198",
      status: "PENDING",
      campaign_id: 1,
      creator_id: 12,
      campaign: {
        id: 1,
        title: "Debug Campaign 1",
        description: "This is a debug campaign to test display",
        imageUrl: "/placeholder.svg",
        category: "Debug",
        brand: {
          id: 1,
          name: "Debug Brand",
          logo: "/placeholder.svg"
        }
      }
    },
    {
      id: 3,
      appliedAt: "2025-05-05 11:10:38.330592",
      status: "PENDING",
      campaign_id: 2,
      creator_id: 12,
      campaign: {
        id: 2,
        title: "Debug Campaign 2",
        description: "This is a debug campaign to test display",
        imageUrl: "/placeholder.svg",
        category: "Debug",
        brand: {
          id: 1,
          name: "Debug Brand",
          logo: "/placeholder.svg"
        }
      }
    }
  ]
  
  return (
    <div className="container mx-auto py-6">
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 text-right">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setDebug(!debug)}
          >
            {debug ? "Use API" : "Use Debug Data"}
          </Button>
        </div>
      )}
      
      {debug ? (
        <ApplicationsList initialApplications={debugApplications} />
      ) : (
        <ApplicationsList />
      )}
    </div>
  )
}
