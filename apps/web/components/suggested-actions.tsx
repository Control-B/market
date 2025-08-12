"use client";

import {
  Baby,
  Scale,
  Heart,
  FileText,
  BarChart3,
  ShoppingCart,
  Users,
  Shield,
  Clock,
  TrendingUp,
} from "lucide-react";

const suggestedActions = [
  {
    icon: ShoppingCart,
    label: "Post RFP",
    description: "Describe your need",
    href: "/rfp/new",
  },
  {
    icon: Scale,
    label: "Compare Offers",
    description: "Side-by-side analysis",
    href: "/compare",
  },
  {
    icon: Users,
    label: "Group Buy",
    description: "Unlock bulk discounts",
    href: "/pools",
  },
  {
    icon: Shield,
    label: "Escrow Protection",
    description: "Secure transactions",
    href: "/escrow",
  },
  {
    icon: TrendingUp,
    label: "Price Intelligence",
    description: "Market insights",
    href: "/pricing",
  },
];

export function SuggestedActions() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {suggestedActions.map((action) => (
        <button
          key={action.href}
          className="group flex items-center space-x-3 px-4 py-3 bg-card border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-200"
        >
          <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
            <action.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
          </div>
          <div className="text-left">
            <div className="font-medium text-foreground group-hover:text-primary">
              {action.label}
            </div>
            <div className="text-sm text-muted-foreground">
              {action.description}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
