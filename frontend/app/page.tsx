import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Lock, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 md:py-32 bg-gradient-to-b from-background to-muted/20">
        <div className="container max-w-5xl text-center space-y-8">
          <Badge variant="outline" className="mb-4">
            Built on Polkadot & Base • Cross-Chain Portfolio
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Showcase Your Blockchain Projects
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Student portfolio platform with pay-to-unlock model. 3 DOT to unlock, work together, leave verified reviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="text-lg">
              <Link href="/portfolios">Browse Portfolios</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg">
              <Link href="/dashboard">Create Your Portfolio</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container max-w-6xl px-4 py-20 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto">
          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Cross-Chain Power</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built on Polkadot ink! contracts and Base Solidity, connected via Hyperbridge for seamless cross-chain interaction.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Instant Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                2.5 DOT goes directly to students, 0.5 DOT to platform. No escrow, no delays. Get paid when projects are unlocked.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>3 DOT to Unlock</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Reviewers pay once to access project details, GitHub repos, and demos. Build trust through verified engagement.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Verified Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Only users who unlocked can review. Reviews are cryptographically verified and stored on-chain.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-muted/30 py-20">
        <div className="container max-w-4xl px-4 mx-auto">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Why DotGo?</h2>
            <div className="grid md:grid-cols-3 gap-8 pt-8">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">For Students</h3>
                <p className="text-muted-foreground">
                  Showcase blockchain projects with verifiable reputation. Get paid when employers/reviewers unlock your work.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">For Employers</h3>
                <p className="text-muted-foreground">
                  Find talented blockchain developers with verified projects. Pay once to unlock, review quality work.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Cross-Chain Native</h3>
                <p className="text-muted-foreground">
                  Built on Polkadot and Base, bridged with Hyperbridge. True cross-chain portfolio platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container max-w-4xl px-4 py-20 mx-auto">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg">
              Join the cross-chain student portfolio revolution
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
            <Button asChild size="lg" variant="secondary">
              <Link href="/portfolios">Explore Portfolios</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/dashboard">Create Portfolio</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 DotGo. Built for sub0 HACK on Polkadot + Base</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-foreground transition-colors">Docs</Link>
              <Link href="#" className="hover:text-foreground transition-colors">GitHub</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
