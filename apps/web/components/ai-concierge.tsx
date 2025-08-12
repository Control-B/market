"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  X,
  Sparkles,
  MessageSquare,
  Lightbulb,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "text" | "suggestion" | "analysis";
  suggestions?: string[];
}

interface AIConciergeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIConcierge({ isOpen, onClose }: AIConciergeProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI Concierge. I can help you with:\n\n• Creating better RFPs\n• Analyzing offers\n• Market insights\n• Negotiation tips\n\nWhat would you like to work on today?",
      timestamp: new Date(),
      type: "text",
      suggestions: [
        "Help me write an RFP",
        "Analyze this offer",
        "Market research",
        "Negotiation advice",
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Simulate AI response - in real app, this would call your AI service
      const response = await simulateAIResponse(content);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
        type: response.type,
        suggestions: response.suggestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAIResponse = async (
    userInput: string
  ): Promise<{
    content: string;
    type: "text" | "suggestion" | "analysis";
    suggestions?: string[];
  }> => {
    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    const lowerInput = userInput.toLowerCase();

    if (
      lowerInput.includes("rfp") ||
      lowerInput.includes("request") ||
      lowerInput.includes("write")
    ) {
      return {
        content:
          "I'd be happy to help you create an RFP! Here are some key elements to include:\n\n**Essential Components:**\n• Clear project objectives\n• Detailed requirements\n• Budget range\n• Timeline expectations\n• Evaluation criteria\n\n**Pro Tips:**\n• Be specific about deliverables\n• Include technical specifications\n• Mention any constraints\n• Set realistic deadlines\n\nWould you like me to help you draft a specific section?",
        type: "suggestion",
        suggestions: [
          "Help me write the description",
          "What should I include in requirements?",
          "How do I set a good budget?",
          "Show me an RFP template",
        ],
      };
    }

    if (
      lowerInput.includes("offer") ||
      lowerInput.includes("analyze") ||
      lowerInput.includes("price")
    ) {
      return {
        content:
          "I can help you analyze offers! Here's what I look for:\n\n**Price Analysis:**\n• Market competitiveness\n• Value for money\n• Hidden costs\n\n**Quality Assessment:**\n• Seller reputation\n• Delivery timeline\n• Technical expertise\n\n**Risk Evaluation:**\n• Payment terms\n• Warranty coverage\n• Dispute resolution\n\nShare the offer details and I'll provide a detailed analysis!",
        type: "analysis",
        suggestions: [
          "Analyze this specific offer",
          "Compare multiple offers",
          "Negotiation tips",
          "Red flags to watch for",
        ],
      };
    }

    if (
      lowerInput.includes("market") ||
      lowerInput.includes("research") ||
      lowerInput.includes("trends")
    ) {
      return {
        content:
          "Here are the current market insights:\n\n**Trending Categories:**\n• Software Development (+15% YoY)\n• Digital Marketing (+12% YoY)\n• AI/ML Services (+25% YoY)\n\n**Price Trends:**\n• Average RFP budget: $12,500\n• Most competitive: Web Development\n• Highest value: AI/ML Projects\n\n**Geographic Insights:**\n• Remote work adoption: 78%\n• Top regions: US, EU, Asia-Pacific\n\nWould you like specific data for your industry?",
        type: "analysis",
        suggestions: [
          "Industry-specific data",
          "Competitor analysis",
          "Pricing benchmarks",
          "Regional insights",
        ],
      };
    }

    if (
      lowerInput.includes("negotiate") ||
      lowerInput.includes("negotiation") ||
      lowerInput.includes("advice")
    ) {
      return {
        content:
          "Great! Here are my negotiation strategies:\n\n**For Buyers:**\n• Start with market research\n• Request multiple quotes\n• Focus on value, not just price\n• Negotiate terms, not just cost\n\n**For Sellers:**\n• Highlight unique value propositions\n• Offer flexible payment terms\n• Provide detailed proposals\n• Showcase past successes\n\n**Key Principles:**\n• Win-win approach\n• Clear communication\n• Document everything\n• Set realistic expectations\n\nWhat's your negotiation scenario?",
        type: "suggestion",
        suggestions: [
          "Buyer negotiation tips",
          "Seller negotiation tips",
          "Contract terms advice",
          "Payment negotiation",
        ],
      };
    }

    // Default response
    return {
      content:
        "I understand you're asking about \"" +
        userInput +
        '". I can help you with:\n\n• **RFP Creation**: Writing clear requirements and specifications\n• **Offer Analysis**: Evaluating proposals and pricing\n• **Market Research**: Understanding trends and benchmarks\n• **Negotiation**: Strategies for both buyers and sellers\n\nWhat specific aspect would you like to explore?',
      type: "suggestion",
      suggestions: [
        "Help me write an RFP",
        "Analyze an offer",
        "Market research",
        "Negotiation advice",
      ],
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg shadow-xl w-full max-w-2xl h-[600px] mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">AI Concierge</h3>
              <p className="text-sm text-muted-foreground">
                Your marketplace assistant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.role === "assistant" && (
                    <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>

                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-muted-foreground">
                          Quick actions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs px-2 py-1 bg-background border border-border rounded hover:bg-muted transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex space-x-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about RFPs, offers, or the marketplace..."
              className="flex-1 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Actions */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => handleSendMessage("Help me write an RFP")}
              className="text-xs px-3 py-1 bg-muted border border-border rounded-full hover:bg-muted/80 transition-colors flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>RFP Help</span>
            </button>
            <button
              onClick={() => handleSendMessage("Analyze this offer")}
              className="text-xs px-3 py-1 bg-muted border border-border rounded-full hover:bg-muted/80 transition-colors flex items-center space-x-1"
            >
              <Lightbulb className="w-3 h-3" />
              <span>Offer Analysis</span>
            </button>
            <button
              onClick={() => handleSendMessage("Market research")}
              className="text-xs px-3 py-1 bg-muted border border-border rounded-full hover:bg-muted/80 transition-colors flex items-center space-x-1"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Market Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

