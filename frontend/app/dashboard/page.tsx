"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { mockProjects } from "@/lib/mock-data";
import { PlusCircle, Eye, EyeOff, Star, Unlock, Trash2, Wallet, Github, ExternalLink } from "lucide-react";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    githubUrl: "",
    demoUrl: "",
  });

  // Mock: Filter projects by connected wallet (in real app, filter by address)
  const userProjects = isConnected ? mockProjects.slice(0, 2) : [];

  const handleCreateProject = () => {
    console.log("Creating project:", formData);
    // TODO: Call smart contract to create project
    setShowCreateDialog(false);
    setFormData({
      title: "",
      description: "",
      skills: "",
      githubUrl: "",
      demoUrl: "",
    });
  };

  // Require wallet connection
  if (!isConnected) {
    return (
      <div className="container max-w-7xl mx-auto py-16 px-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="py-16 text-center">
            <Wallet className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Connect your wallet to access your student dashboard and create portfolios
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 md:py-8 space-y-6 md:space-y-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Manage your portfolios and track performance
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="default" className="w-full md:w-auto">
              <PlusCircle className="mr-2 h-4 md:h-5 w-4 md:w-5" />
              <span className="hidden sm:inline">Create New Portfolio</span>
              <span className="sm:hidden">New Portfolio</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Portfolio</DialogTitle>
              <DialogDescription>
                Showcase your blockchain project to potential employers and reviewers
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Title *</label>
                <Input
                  placeholder="DeFi Yield Aggregator on Polkadot"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  placeholder="Describe your project, technologies used, and what makes it unique..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Skills/Technologies *</label>
                <Input
                  placeholder="Substrate, ink!, Rust, React, TypeScript (comma-separated)"
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData({ ...formData, skills: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Add relevant technologies and skills used in your project
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub URL</label>
                <Input
                  type="url"
                  placeholder="https://github.com/yourusername/project"
                  value={formData.githubUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, githubUrl: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Live Demo URL</label>
                <Input
                  type="url"
                  placeholder="https://your-demo.vercel.app"
                  value={formData.demoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, demoUrl: e.target.value })
                  }
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-semibold">Pay-to-Unlock Model</p>
                <p className="text-xs text-muted-foreground">
                  Reviewers will pay <span className="font-semibold">3 DOT</span> to unlock your portfolio details:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                  <li>• <span className="font-semibold">2.5 DOT</span> goes directly to you</li>
                  <li>• <span className="font-semibold">0.5 DOT</span> platform fee</li>
                  <li>• Only unlocked users can leave verified reviews</li>
                </ul>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleCreateProject}
                disabled={!formData.title || !formData.description || !formData.skills}
              >
                Create Portfolio
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader className="pb-2 md:pb-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Total Portfolios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold">{userProjects.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 md:pb-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Total Unlocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold">
              {userProjects.reduce((sum, p) => sum + p.unlock_count, 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 md:pb-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold">
              {(userProjects.reduce((sum, p) => sum + p.unlock_count, 0) * 2.5).toFixed(1)} DOT
            </p>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
              From {userProjects.reduce((sum, p) => sum + p.unlock_count, 0)} unlocks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* My Portfolios */}
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold">My Portfolios</h2>

        {userProjects.length > 0 ? (
          <div className="space-y-4">
            {userProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle>{project.title}</CardTitle>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="icon" variant="outline" title="View portfolio">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" title="Delete portfolio">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Unlock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-2xl font-bold">{project.unlock_count}</p>
                        <p className="text-xs text-muted-foreground">Unlocks</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-2xl font-bold">
                          {project.review_count > 0 ? project.avg_rating.toFixed(1) : "-"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {project.review_count} reviews
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {(project.unlock_count * 2.5).toFixed(1)} DOT
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Earned
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline">
                          <Github className="h-4 w-4 mr-1" />
                          GitHub
                        </Button>
                      </a>
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Demo
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <PlusCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No portfolios yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first portfolio to start receiving unlock payments
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                Create Your First Portfolio
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
