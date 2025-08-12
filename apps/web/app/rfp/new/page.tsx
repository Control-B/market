"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function NewRFPPage() {
  const router = useRouter();
  const [isPrivate, setIsPrivate] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budgetMin: "",
    budgetMax: "",
    deadline: "",
    location: "",
  });

  const categories = [
    "Software Development",
    "Consulting",
    "Design",
    "Marketing",
    "Hardware",
    "Services",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/v1/rfps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          budget_min: formData.budgetMin ? parseInt(formData.budgetMin) : null,
          budget_max: formData.budgetMax ? parseInt(formData.budgetMax) : null,
          deadline: new Date(formData.deadline).toISOString(),
          location: formData.location,
          is_private: isPrivate,
        }),
      });

      if (response.ok) {
        const rfp = await response.json();
        router.push(`/rfp/${rfp.id}`);
      } else {
        console.error("Failed to create RFP");
      }
    } catch (error) {
      console.error("Error creating RFP:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Link>
              <h1 className="text-2xl font-bold">Create New RFP</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
              >
                {showPreview ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <span>{showPreview ? "Hide" : "Show"} Preview</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  RFP Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Website Redesign for E-commerce Platform"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={8}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Describe your requirements in detail. Be specific about what you need, timeline, and any constraints..."
                  required
                />
              </div>

              {/* Budget Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Minimum Budget
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <input
                      type="number"
                      value={formData.budgetMin}
                      onChange={(e) =>
                        handleInputChange("budgetMin", e.target.value)
                      }
                      className="w-full pl-8 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Maximum Budget
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <input
                      type="number"
                      value={formData.budgetMax}
                      onChange={(e) =>
                        handleInputChange("budgetMax", e.target.value)
                      }
                      className="w-full pl-8 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="10000"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Deadline *
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) =>
                    handleInputChange("deadline", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., New York, NY or Remote"
                />
              </div>

              {/* Privacy Toggle */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="private"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <label htmlFor="private" className="text-sm">
                  Make this RFP private (only visible to you)
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex items-center space-x-4 pt-6">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Create RFP</span>
                </button>
                <Link
                  href="/"
                  className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h3 className="text-lg font-semibold mb-4">Preview</h3>
                <div className="border border-border rounded-lg p-6 bg-card">
                  <h4 className="font-semibold text-lg mb-2">
                    {formData.title || "RFP Title"}
                  </h4>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Category:</span>{" "}
                      {formData.category || "Not specified"}
                    </div>
                    <div>
                      <span className="font-medium">Budget:</span>{" "}
                      {formData.budgetMin && formData.budgetMax
                        ? `$${formData.budgetMin} - $${formData.budgetMax}`
                        : formData.budgetMin
                        ? `From $${formData.budgetMin}`
                        : formData.budgetMax
                        ? `Up to $${formData.budgetMax}`
                        : "Not specified"}
                    </div>
                    <div>
                      <span className="font-medium">Deadline:</span>{" "}
                      {formData.deadline
                        ? new Date(formData.deadline).toLocaleDateString()
                        : "Not specified"}
                    </div>
                    {formData.location && (
                      <div>
                        <span className="font-medium">Location:</span>{" "}
                        {formData.location}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Privacy:</span>{" "}
                      {isPrivate ? "Private" : "Public"}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <h5 className="font-medium mb-2">Description:</h5>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {formData.description || "No description provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
