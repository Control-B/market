"use client";

import { useState } from "react";
import {
  Search,
  Grid3X3,
  HelpCircle,
  Globe,
  Paperclip,
  Mic,
  Send,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Handle search submission
      console.log("Search query:", query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center bg-card border border-border rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
        {/* Left side icons */}
        <div className="flex items-center space-x-3 mr-3">
          <Search className="w-5 h-5 text-primary" />
          <div className="w-px h-5 bg-border" />
          <Sparkles className="w-4 h-4 text-muted-foreground" />
          <HelpCircle className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* Input field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Post your need, get AI-matched offers..."
          className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg"
        />

        {/* Right side icons */}
        <div className="flex items-center space-x-2 ml-3">
          <button
            type="button"
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            title="AI Tools"
          >
            <Grid3X3 className="w-4 h-4 text-muted-foreground" />
          </button>

          <button
            type="button"
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            title="Global Search"
          >
            <Globe className="w-4 h-4 text-muted-foreground" />
          </button>

          <button
            type="button"
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            title="Attach Files"
          >
            <Paperclip className="w-4 h-4 text-muted-foreground" />
          </button>

          <button
            type="button"
            onClick={() => setIsListening(!isListening)}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              isListening
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground"
            )}
            title="Voice Input"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={!query.trim()}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              query.trim()
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
            title="Submit"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
}
