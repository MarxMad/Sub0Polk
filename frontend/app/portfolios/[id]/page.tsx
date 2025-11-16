"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockProjects, mockReviews } from "@/lib/mock-data";
import { Github, ExternalLink, Lock, Unlock, Star, Calendar, User, Loader2 } from "lucide-react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract";

export default function PortfolioDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { isConnected, address } = useAccount();
  const [isUnlocked, setIsUnlocked] = useState(false);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const project = mockProjects.find((p) => p.id === id);
  const reviews = mockReviews[id] || [];

  const handleUnlock = async () => {
    if (!isConnected || !address) return;

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "unlockProject",
        args: [BigInt(id)],
        value: parseEther("3.0"), // 3 tokens
      });
    } catch (error) {
      console.error("Error unlocking project:", error);
    }
  };

  if (!project) {
    return (
      <div className="container max-w-4xl mx-auto py-16 px-4">
        <Card>
          <CardContent className="py-16 text-center">
            <h2 className="text-2xl font-bold mb-2">Portfolio Not Found</h2>
            <p className="text-muted-foreground">
              The portfolio you&apos;re looking for doesn&apos;t exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="space-y-2 flex-1">
          <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{project.student.slice(0, 10)}...{project.student.slice(-8)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(project.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Unlock className="h-4 w-4" />
              <span>{project.unlock_count} unlocks</span>
            </div>
            {project.review_count > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{project.avg_rating.toFixed(1)}</span>
                <span>({project.review_count} reviews)</span>
              </div>
            )}
          </div>
        </div>

        {!isUnlocked && (
          <Card className="w-full md:w-auto">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-yellow-600">
                <Lock className="h-5 w-5" />
                <span className="font-semibold">Locked Portfolio</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Pay 3 ETH to unlock full project details, GitHub repo, and demo.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">To Student:</span>
                  <span className="font-medium">2.5 ETH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee:</span>
                  <span className="font-medium">0.5 ETH</span>
                </div>
                <div className="pt-2 border-t flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>3.0 ETH</span>
                </div>
              </div>
              <Button
                className="w-full"
                disabled={!isConnected || isPending || isConfirming}
                onClick={handleUnlock}
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isPending ? "Confirm in wallet..." : "Unlocking..."}
                  </>
                ) : isConnected ? (
                  "Unlock Portfolio (3 ETH)"
                ) : (
                  "Connect Wallet"
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {project.skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="text-sm">
            {skill}
          </Badge>
        ))}
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>About This Project</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {project.description}
          </p>
        </CardContent>
      </Card>

      {/* Locked Content */}
      {!isUnlocked && (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center space-y-4">
            <Lock className="h-16 w-16 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Unlock to View</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Pay 3 ETH to access GitHub repository, live demo, detailed documentation, and the ability to leave a verified review.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Github className="h-4 w-4" />
                <span>GitHub Access</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ExternalLink className="h-4 w-4" />
                <span>Live Demo</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4" />
                <span>Leave Review</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unlocked Content */}
      {isUnlocked && (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  GitHub Repository
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    View on GitHub
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Live Demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                    Launch Demo
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews ({reviews.length})</CardTitle>
          <CardDescription>
            Only users who unlocked this portfolio can leave reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review, idx) => (
                <div key={idx} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {review.reviewer.slice(0, 6)}...{review.reviewer.slice(-4)}
                      </span>
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
            <p className="text-center text-muted-foreground py-8">
              No reviews yet. Be the first to unlock and review!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
