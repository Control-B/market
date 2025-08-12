"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bot, Plus, Trash2, Save, Send, Sparkles } from "lucide-react";

interface RFPForm {
  title: string;
  description: string;
  category: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  location: string;
  requirements: string[];
  is_private: boolean;
}

export default function CreateRFPPage() {
  const router = useRouter();
  const [form, setForm] = useState<RFPForm>({
    title: "",
    description: "",
    category: "",
    budget_min: 0,
    budget_max: 0,
    deadline: "",
    location: "",
    requirements: [""],
    is_private: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiHelp, setShowAiHelp] = useState(false);

  const categories = [
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
    "Other",
  ];

  const handleInputChange = (field: keyof RFPForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addRequirement = () => {
    setForm(prev => ({
      ...prev,
      requirements: [...prev.requirements, ""]
    }));
  };

  const removeRequirement = (index: number) => {
    setForm(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const getAiSuggestions = async () => {
    if (!form.description) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/ai-concierge/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message: `Help me improve this RFP description: ${form.description}`,
          context: { user_role: "buyer" }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiSuggestions(data.suggestions || []);
        setShowAiHelp(true);
      }
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/rfps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...form,
          requirements: form.requirements.filter(req => req.trim() !== ""),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/rfps/${data.id}`);
      } else {
        throw new Error("Failed to create RFP");
      }
    } catch (error) {
      console.error("Error creating RFP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Create New RFP</h1>
            <p className="text-muted-foreground mt-2">
              Post your requirements and let AI match you with the best sellers
            </p>
          </div>
          <Button
            onClick={() => setShowAiHelp(!showAiHelp)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            AI Assistant
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>RFP Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g., Website Development for E-commerce Platform"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={form.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <div className="relative">
                      <Textarea
                        id="description"
                        value={form.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Describe your project requirements in detail..."
                        rows={6}
                        required
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={getAiSuggestions}
                        disabled={isLoading || !form.description}
                      >
                        <Sparkles className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budget_min">Minimum Budget ($)</Label>
                      <Input
                        id="budget_min"
                        type="number"
                        value={form.budget_min}
                        onChange={(e) => handleInputChange("budget_min", parseInt(e.target.value) || 0)}
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="budget_max">Maximum Budget ($)</Label>
                      <Input
                        id="budget_max"
                        type="number"
                        value={form.budget_max}
                        onChange={(e) => handleInputChange("budget_max", parseInt(e.target.value) || 0)}
                        placeholder="5000"
                      />
                    </div>
                  </div>

                  {/* Deadline and Location */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deadline">Deadline *</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={form.deadline}
                        onChange={(e) => handleInputChange("deadline", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location (Optional)</Label>
                      <Input
                        id="location"
                        value={form.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="e.g., Remote, New York, etc."
                      />
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <Label>Requirements</Label>
                    <div className="space-y-2">
                      {form.requirements.map((req, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={req}
                            onChange={(e) => updateRequirement(index, e.target.value)}
                            placeholder={`Requirement ${index + 1}`}
                          />
                          {form.requirements.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeRequirement(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addRequirement}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Requirement
                      </Button>
                    </div>
                  </div>

                  {/* Privacy */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_private"
                      checked={form.is_private}
                      onChange={(e) => handleInputChange("is_private", e.target.checked)}
                    />
                    <Label htmlFor="is_private">Make this RFP private (only invited sellers can see)</Label>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Creating..." : "Create RFP"}
                    </Button>
                    <Button type="button" variant="outline" disabled={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant Sidebar */}
          <div className="lg:col-span-1">
            {showAiHelp && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    AI Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aiSuggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left h-auto p-3"
                        onClick={() => {
                          // Handle suggestion click
                          console.log("Suggestion clicked:", suggestion);
                        }}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tips Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Writing Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <p><strong>Be Specific:</strong> Include detailed requirements and constraints</p>
                  <p><strong>Set Realistic Budget:</strong> Research market rates for similar projects</p>
                  <p><strong>Clear Timeline:</strong> Specify milestones and deadlines</p>
                  <p><strong>Quality Standards:</strong> Mention any certifications or quality requirements</p>
                </div>
              </CardContent>
            </Card>

            {/* Templates Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>RFP Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["Software Development", "Digital Marketing", "Consulting"].map((template) => (
                    <Button
                      key={template}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        // Load template
                        console.log("Load template:", template);
                      }}
                    >
                      {template} Template
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
