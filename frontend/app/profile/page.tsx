"use client";

import { useAccount } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Wallet, FileText, Star } from "lucide-react";
import { mockProjects, mockReviews } from "@/lib/mock-data";

export default function ProfilePage() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="container max-w-4xl mx-auto py-16 px-4">
        <Card>
          <CardContent className="py-16 text-center">
            <Wallet className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Connect Wallet</h2>
            <p className="text-muted-foreground">
              Please connect your wallet to view your profile.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock user projects (filter by address)
  const userProjects = mockProjects.filter(p => p.student.toLowerCase() === address?.toLowerCase());

  // Mock user reviews (filter reviews user has written)
  const userReviews = Object.values(mockReviews)
    .flat()
    .filter(r => r.reviewer.toLowerCase() === address?.toLowerCase());

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Your Profile</CardTitle>
                <CardDescription className="font-mono text-sm">
                  {address?.slice(0, 10)}...{address?.slice(-8)}
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              Base Sepolia
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Your Portfolios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userProjects.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Published projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="h-4 w-4" />
              Reviews Written
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userReviews.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Total reviews given
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              ETH Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0.0</p>
            <p className="text-xs text-muted-foreground mt-1">
              From unlocked portfolios
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Your Portfolios */}
      <Card>
        <CardHeader>
          <CardTitle>Your Portfolios</CardTitle>
          <CardDescription>
            Projects you've submitted to DotGo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userProjects.length > 0 ? (
            <div className="space-y-4">
              {userProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex-1">
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-medium">{project.unlock_count} unlocks</p>
                    {project.review_count > 0 && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{project.avg_rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                You haven't created any portfolios yet.
              </p>
              <Button asChild className="mt-4">
                <a href="/dashboard">Create Portfolio</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Your Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Your Reviews</CardTitle>
          <CardDescription>
            Reviews you've written for other portfolios
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userReviews.length > 0 ? (
            <div className="space-y-4">
              {userReviews.map((review, idx) => (
                <div key={idx} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                You haven't written any reviews yet.
              </p>
              <Button asChild variant="outline" className="mt-4">
                <a href="/portfolios">Browse Portfolios</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
