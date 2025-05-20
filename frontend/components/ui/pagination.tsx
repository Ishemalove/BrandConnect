import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxDisplayed?: number
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  maxDisplayed = 5 
}: PaginationProps) {
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []
    
    // Always include first page
    pageNumbers.push(1)
    
    // Calculate range to display around current page
    const rangeStart = Math.max(2, currentPage - Math.floor(maxDisplayed / 2))
    const rangeEnd = Math.min(totalPages - 1, rangeStart + maxDisplayed - 2)
    
    // Add separator after first page if needed
    if (rangeStart > 2) {
      pageNumbers.push(-1) // Use -1 to represent ellipsis
    }
    
    // Add pages in the calculated range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageNumbers.push(i)
    }
    
    // Add separator before last page if needed
    if (rangeEnd < totalPages - 1) {
      pageNumbers.push(-2) // Use -2 to represent ellipsis
    }
    
    // Always include last page if it's not already in the list
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }
    
    return pageNumbers
  }
  
  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null
  }
  
  const pageNumbers = getPageNumbers()
  
  return (
    <div className="flex items-center justify-center space-x-1 md:space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {pageNumbers.map((pageNumber, index) => (
        pageNumber < 0 ? (
          <Button 
            key={`ellipsis-${index}`} 
            variant="ghost" 
            size="icon" 
            disabled
            className="cursor-default"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            key={pageNumber}
            variant={currentPage === pageNumber ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(pageNumber)}
            aria-label={`Page ${pageNumber}`}
            aria-current={currentPage === pageNumber ? "page" : undefined}
          >
            {pageNumber}
          </Button>
        )
      ))}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
