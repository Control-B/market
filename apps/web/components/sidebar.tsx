"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Globe,
  Layers,
  Home,
  ShoppingBag,
  GraduationCap,
  DollarSign,
  Plane,
  Library,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { icon: Home, label: "Home", href: "/", active: true },
  { icon: Globe, label: "RFPs", href: "/rfps" },
  { icon: Layers, label: "Spaces", href: "/spaces" },
];

const categories = [
  { icon: DollarSign, label: "Finance", href: "/category/finance" },
  { icon: Plane, label: "Travel", href: "/category/travel" },
  { icon: ShoppingBag, label: "Shopping", href: "/category/shopping" },
  { icon: GraduationCap, label: "Academic", href: "/category/academic" },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col bg-card border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                AI
              </span>
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-foreground">Marketplace</span>
            )}
          </div>
        </div>
      </div>

      {/* New RFP Button */}
      <div className="p-4">
        <Link
          href="/rfp/new"
          className="w-full bg-primary text-primary-foreground rounded-lg p-3 flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {!isCollapsed && <span className="ml-2">New RFP</span>}
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
              item.active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <item.icon className="w-5 h-5" />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Categories */}
      <div className="px-4 py-2">
        {!isCollapsed && (
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Categories
          </h3>
        )}
        <div className="space-y-1">
          {categories.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </div>
      </div>

      {/* Library Section */}
      <div className="px-4 py-2 border-t border-border">
        {!isCollapsed && (
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Library
          </h3>
        )}
        <button className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full">
          <Plus className="w-4 h-4" />
          {!isCollapsed && <span className="text-sm">Create Thread</span>}
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <button className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full">
          <MessageSquare className="w-4 h-4" />
          {!isCollapsed && <span className="text-sm">Support</span>}
        </button>
        <button className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full">
          <Settings className="w-4 h-4" />
          {!isCollapsed && <span className="text-sm">Settings</span>}
        </button>
        <button className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full">
          <User className="w-4 h-4" />
          {!isCollapsed && <span className="text-sm">Sign In</span>}
        </button>
      </div>
    </div>
  );
}
