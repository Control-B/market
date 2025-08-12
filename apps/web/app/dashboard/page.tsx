"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Eye,
  MessageSquare,
  Bot,
  Sparkles,
  BarChart3,
  Calendar,
  MapPin
} from "lucide-react";

interface DashboardStats {
  total_rfps: number;
  active_offers: number;
  completed_orders: number;
  total_spent: number;
  avg_response_time: number;
  success_rate: number;
}

interface RecentActivity {
  id: string;
  type: "rfp_created" | "offer_received" | "order_completed" | "payment_received";
  title: string;
  description: string;
  amount?: number;
  timestamp: string;
  status: string;
}

interface AIInsight {
  type: "opportunity" | "risk" | "trend" | "recommendation";
  title: string;
  description: string;
  action?: string;
  priority: "high" | "medium" | "low";
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total_rfps: 0,
    active_offers: 0,
    completed_orders: 0,
    total_spent: 0,
    avg_response_time: 0,
    success_rate: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockStats: DashboardStats = {
      total_rfps: 15,
      active_offers: 8,
      completed_orders: 12,
      total_spent: 45000,
      avg_response_time: 2.5,
      success_rate: 85,
    };

    const mockActivity: RecentActivity[] = [
      {
        id: "1",
        type: "offer_received",
        title: "New offer received",
        description: "Web development offer for $8,500",
        amount: 8500,
        timestamp: "2024-01-15T10:30:00Z",
        status: "pending"
      },
      {
        id: "2",
        type: "order_completed",
        title: "Order completed",
        description: "Logo design project delivered",
        amount: 1200,
        timestamp: "2024-01-14T16:45:00Z",
        status: "completed"
      },
      {
        id: "3",
        type: "rfp_created",
        title: "RFP published",
        description: "Mobile app development RFP",
        timestamp: "2024-01-13T09:15:00Z",
        status: "active"
      },
      {
        id: "4",
        type: "payment_received",
        title: "Payment received",
        description: "Consulting project payment",
        amount: 3500,
        timestamp: "2024-01-12T14:20:00Z",
        status: "completed"
      }
    ];

    const mockInsights: AIInsight[] = [
      {
        type: "opportunity",
        title: "High-value RFP opportunity",
        description: "A $25K software development project matches your profile perfectly. 95% match score.",
        action: "View RFP",
        priority: "high"
      },
      {
        type: "trend",
        title: "Market trend detected",
        description: "Web development RFPs increased 23% this month. Consider updating your profile.",
        action: "Update Profile",
        priority: "medium"
      },
      {
        type: "recommendation",
        title: "Pricing optimization",
        description: "Your rates are 15% below market average. Consider increasing by 10-15%.",
        action: "Review Pricing",
        priority: "medium"
      },
      {
        type: "risk",
        title: "Response time alert",
        description: "Your average response time increased to 3.2 days. Aim for under 24 hours.",
        action: "Improve Response Time",
        priority: "high"
      }
    ];

    setStats(mockStats);
    setRecentActivity(mockActivity);
    setAiInsights(mockInsights);
    setIsLoading(false);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "rfp_created":
        return <FileText className="w-4 h-4" />;
      case "offer_received":
        return <MessageSquare className="w-4 h-4" />;
      case "order_completed":
        return <CheckCircle className="w-4 h-4" />;
      case "payment_received":
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "rfp_created":
        return "text-blue-600 bg-blue-100";
      case "offer_received":
        return "text-green-600 bg-green-100";
      case "order_completed":
        return "text-purple-600 bg-purple-100";
      case "payment_received":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "opportunity":
        return "text-green-600 bg-green-100";
      case "risk":
        return "text-red-600 bg-red-100";
      case "trend":
        return "text-blue-600 bg-blue-100";
      case "recommendation":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse space-y-6">
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
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening with your marketplace activity.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
          <Link href="/rfps/new">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create RFP
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total RFPs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_rfps}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_offers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5</span> new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.total_spent)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.success_rate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{activity.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                      {activity.amount && (
                        <p className="text-sm font-medium text-green-600 mt-1">
                          {formatCurrency(activity.amount)}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                AI Insights
                <Badge variant="outline" className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Live
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`p-2 rounded-full ${getInsightColor(insight.type)}`}>
                        {insight.type === "opportunity" && <TrendingUp className="w-4 h-4" />}
                        {insight.type === "risk" && <AlertCircle className="w-4 h-4" />}
                        {insight.type === "trend" && <BarChart3 className="w-4 h-4" />}
                        {insight.type === "recommendation" && <Sparkles className="w-4 h-4" />}
                      </div>
                      <Badge className={getPriorityColor(insight.priority)}>
                        {insight.priority}
                      </Badge>
                    </div>
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {insight.description}
                    </p>
                    {insight.action && (
                      <Button size="sm" variant="outline" className="w-full">
                        {insight.action}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/rfps/new">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Plus className="w-6 h-6" />
                  <span>Create RFP</span>
                </Button>
              </Link>
              <Link href="/rfps">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Eye className="w-6 h-6" />
                  <span>Browse RFPs</span>
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <MessageSquare className="w-6 h-6" />
                <span>View Offers</span>
              </Button>
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Bot className="w-6 h-6" />
                <span>AI Assistant</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
