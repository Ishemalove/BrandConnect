"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CampaignGallery } from "@/components/dashboard/campaign-gallery"
import { Search, Filter, SlidersHorizontal } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  // Get query parameters with defaults
  const initialQuery = searchParams.get('query') || ''
  const initialSort = searchParams.get('sort') || 'newest'
  const initialCategory = searchParams.get('category') || 'all'
  const initialPage = parseInt(searchParams.get('page') || '1', 10)
  
  // Set state from URL parameters
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState<string>(initialQuery)
  const [sortBy, setSortBy] = useState<string>(initialSort)
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory)
  const [currentPage, setCurrentPage] = useState<number>(initialPage)
  const [itemsPerPage] = useState<number>(6)
  
  // Update URL when parameters change
  const createQueryString = (params: Record<string, string | number | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    
    Object.entries(params).forEach(([name, value]) => {
      if (value === null) {
        newSearchParams.delete(name)
      } else {
        newSearchParams.set(name, value.toString())
      }
    })
    
    return newSearchParams.toString()
  }
  
  // Update URL when filter parameters change
  useEffect(() => {
    const newQueryString = createQueryString({
      query: debouncedQuery || null,
      sort: sortBy,
      category: activeCategory === 'all' ? null : activeCategory,
      page: currentPage === 1 ? null : currentPage,
    })
    
    router.push(`${pathname}?${newQueryString}`, { scroll: false })
  }, [debouncedQuery, sortBy, activeCategory, currentPage, pathname, router])
  
  // Debounce search query to avoid too many URL updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery)
      // Reset to page 1 when search query changes
      if (currentPage !== 1) {
        setCurrentPage(1)
      }
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [searchQuery, currentPage])
  
  // Handle category tab change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setCurrentPage(1) // Reset to page 1 when category changes
  }
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value)
    setCurrentPage(1) // Reset to page 1 when sort changes
  }
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('')
    setSortBy('newest')
    setActiveCategory('all')
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Explore Campaigns</h1>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filter Campaigns</SheetTitle>
                <SheetDescription>Refine your search to find the perfect campaigns</SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Categories</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["Fashion", "Beauty", "Technology", "Gaming", "Food", "Travel", "Fitness", "Lifestyle"].map(
                      (category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`category-${category}`} 
                            checked={activeCategory.toLowerCase() === category.toLowerCase()}
                            onCheckedChange={() => handleCategoryChange(category.toLowerCase())}
                          />
                          <Label htmlFor={`category-${category}`}>{category}</Label>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Campaign Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="status-active" defaultChecked />
                      <Label htmlFor="status-active">Active Campaigns</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="status-available" defaultChecked />
                      <Label htmlFor="status-available">Available for Work</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium">Campaign Duration</h3>
                    <span className="text-sm text-muted-foreground">7+ days</span>
                  </div>
                  <Slider defaultValue={[7]} max={30} step={1} />
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Sort By</h3>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="ending">Ending Soon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={handleResetFilters}>
                    Reset
                  </Button>
                  <Button className="flex-1" onClick={() => {}}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Button variant="outline" size="icon" className="md:hidden">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="ending">Ending Soon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Campaigns</TabsTrigger>
          <TabsTrigger value="fashion">Fashion</TabsTrigger>
          <TabsTrigger value="technology">Technology</TabsTrigger>
          <TabsTrigger value="food">Food</TabsTrigger>
          <TabsTrigger value="travel">Travel</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <CampaignGallery 
            searchQuery={debouncedQuery}
            sortBy={sortBy}
            category="all"
            page={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </TabsContent>
        <TabsContent value="fashion">
          <CampaignGallery 
            searchQuery={debouncedQuery}
            sortBy={sortBy}
            category="fashion"
            page={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </TabsContent>
        <TabsContent value="technology">
          <CampaignGallery 
            searchQuery={debouncedQuery}
            sortBy={sortBy}
            category="technology"
            page={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </TabsContent>
        <TabsContent value="food">
          <CampaignGallery 
            searchQuery={debouncedQuery}
            sortBy={sortBy}
            category="food"
            page={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </TabsContent>
        <TabsContent value="travel">
          <CampaignGallery 
            searchQuery={debouncedQuery}
            sortBy={sortBy}
            category="travel"
            page={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
