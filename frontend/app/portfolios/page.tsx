"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PortfolioCard } from "@/components/portfolios/portfolio-card";
import { mockProjects } from "@/lib/mock-data";
import { Search } from "lucide-react";

export default function PortfoliosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Get all unique skills
  const allSkills = Array.from(
    new Set(mockProjects.flatMap((p) => p.skills))
  ).sort();

  // Filter projects
  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesSkill =
      !selectedSkill || project.skills.includes(selectedSkill);

    return matchesSearch && matchesSkill;
  });

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Browse Portfolios</h1>
        <p className="text-lg text-muted-foreground">
          Discover talented blockchain students and their projects. Pay 3 ETH to unlock full details.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, description, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Skills Filter */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Filter by skill:</p>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedSkill === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedSkill(null)}
            >
              All
            </Badge>
            {allSkills.map((skill) => (
              <Badge
                key={skill}
                variant={selectedSkill === skill ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedSkill(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredProjects.length} {filteredProjects.length === 1 ? "portfolio" : "portfolios"} found
      </div>

      {/* Portfolio Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <PortfolioCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            No portfolios found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
