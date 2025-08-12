"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { SearchBar } from "@/components/search-bar";
import { SuggestedActions } from "@/components/suggested-actions";
import { AuthModal } from "@/components/auth-modal";
import { AIConcierge } from "@/components/ai-concierge";
import { Bot } from "lucide-react";

export default function HomePage() {
  const [isAIConciergeOpen, setIsAIConciergeOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-2xl">
          {/* Brand */}
          <h1 className="text-6xl font-bold text-foreground">ai marketplace</h1>

          {/* Search Bar */}
          <div className="w-full max-w-2xl">
            <SearchBar />
          </div>

          {/* Suggested Actions */}
          <SuggestedActions />
        </div>
      </main>

      {/* AI Concierge Floating Button */}
      <button
        onClick={() => setIsAIConciergeOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
      >
        <Bot className="w-6 h-6" />
        <span className="absolute right-16 bg-background text-foreground px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          AI Concierge
        </span>
      </button>

      {/* Auth Modal */}
      <AuthModal />

      {/* AI Concierge */}
      <AIConcierge
        isOpen={isAIConciergeOpen}
        onClose={() => setIsAIConciergeOpen(false)}
      />
    </div>
  );
}
