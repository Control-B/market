"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, MapPin, Calendar, DollarSign, Users, Bot, Sparkles } from "lucide-react";

interface RFP {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  location: string;
  status: string;
  buyer: {
    name: string;
    rating: number;
  };
  offers_count: number;
  created_at: string;
  ai_summary?: string;
}

export default function RFPsPage() {
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [filteredRfps, setFilteredRfps] = useState<RFP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const categories = [
    "All Categories",
    "Software Development",
    "Web Design",
    "Digital Marketing",
    "Consulting",
    "Content Creation",
    "Data Analysis",
    "Graphic Design",
    "Video Production",
    "Translation",
    "Legal Services",
    "Accounting",
  ];

  const statuses = [
    "All Statuses",
    "Published",
    "In Progress",
    "Awarded",
    "Closed",
  ];

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockRfps: RFP[] = [
      {
        id: "1",
        title: "E-commerce Website Development",
        description: "We need a modern e-commerce website with payment integration, inventory management, and mobile responsiveness.",
        category: "Software Development",
        budget_min: 5000,
        budget_max: 15000,
        deadline: "2024-03-15",
        location: "Remote",
        status: "Published",
        buyer: { name: "TechCorp Inc.", rating: 4.8 },
        offers_count: 12,
        created_at: "2024-01-15",
        ai_summary: "High-value e-commerce project requiring full-stack development with modern tech stack."
      },
      {
        id: "2",
        title: "Digital Marketing Campaign for SaaS",
        description: "Comprehensive digital marketing campaign including SEO, PPC, content marketing, and social media management.",
        category: "Digital Marketing",
        budget_min: 3000,
        budget_max: 8000,
        deadline: "2024-02-28",
        location: "Remote",
        status: "Published",
        buyer: { name: "SaaS Startup", rating: 4.5 },
        offers_count: 8,
        created_at: "2024-01-10",
        ai_summary: "B2B SaaS marketing campaign with focus on lead generation and brand awareness."
      },
      {
        id: "3",
        title: "Business Process Optimization",
        description: "Consulting services to optimize our manufacturing processes and improve efficiency by 25%.",
        category: "Consulting",
        budget_min: 10000,
        budget_max: 25000,
        deadline: "2024-04-01",
        location: "New York",
        status: "Published",
        buyer: { name: "Manufacturing Co.", rating: 4.9 },
        offers_count: 5,
        created_at: "2024-01-08",
        ai_summary: "Manufacturing optimization project requiring industry expertise and process improvement skills."
      },
    ];

    setRfps(mockRfps);
    setFilteredRfps(mockRfps);
    setIsLoading(false);
  }, []);

  // Filter and sort RFPs
  useEffect(() => {
    let filtered = rfps.filter(rfp => {
      const matchesSearch = rfp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rfp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rfp.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || rfp.category === selectedCategory;
      const matchesStatus = selectedStatus === "all" || rfp.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort RFPs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "budget_high":
          return b.budget_max - a.budget_max;
        case "budget_low":
          return a.budget_min - b.budget_min;
        case "deadline":
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        default:
          return 0;
      }
    });

    setFilteredRfps(filtered);
  }, [rfps, searchTerm, selectedCategory, selectedStatus, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Awarded":
        return "bg-purple-100 text-purple-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatBudget = (min: number, max: number) => {
    if (min === max) return `$${min.toLocaleString()}`;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Browse RFPs</h1>
          <p className="text-muted-foreground mt-2">
            Find the perfect projects for your skills and expertise
          </p>
        </div>
        <Link href="/rfps/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create RFP
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search RFPs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="budget_high">Highest Budget</SelectItem>
                <SelectItem value="budget_low">Lowest Budget</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
              </SelectContent>
            </Select>

            {/* AI Insights Button */}
            <Button variant="outline" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Insights
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Showing {filteredRfps.length} of {rfps.length} RFPs
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI Matched
          </Badge>
        </div>
      </div>

      {/* RFP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRfps.map((rfp) => (
          <Card key={rfp.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">
                    <Link href={`/rfps/${rfp.id}`} className="hover:text-primary">
                      {rfp.title}
                    </Link>
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{rfp.category}</Badge>
                    <Badge className={getStatusColor(rfp.status)}>{rfp.status}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {rfp.description}
              </p>

              {/* AI Summary */}
              {rfp.ai_summary && (
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <div className="flex items-start gap-2">
                    <Bot className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">{rfp.ai_summary}</p>
                  </div>
                </div>
              )}

              {/* Key Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-medium">{formatBudget(rfp.budget_min, rfp.budget_max)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span>Deadline: {formatDate(rfp.deadline)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{rfp.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>{rfp.offers_count} offers received</span>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {rfp.buyer.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{rfp.buyer.name}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">★ {rfp.buyer.rating}</span>
                    </div>
                  </div>
                </div>
                <Link href={`/rfps/${rfp.id}`}>
                  <Button size="sm">View Details</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredRfps.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No RFPs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedStatus("all");
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
