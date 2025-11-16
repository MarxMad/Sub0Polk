"use client";

import Link from "next/link";
import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { isConnected } = useAccount();

  const publicNavLinks: Array<{ href: string; label: string; badge?: string }> = [
    { href: "/portfolios", label: "Browse Portfolios" },
    { href: "/arkiv-demo", label: "Arkiv Demo", badge: "🏆" },
  ];

  const privateNavLinks: Array<{ href: string; label: string; badge?: string }> = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profile", label: "Profile" },
  ];

  const navLinks = isConnected
    ? [...publicNavLinks, ...privateNavLinks]
    : publicNavLinks;

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              DG
            </div>
            <span className="text-lg md:text-xl font-bold">DotGo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                {link.label}
                {link.badge && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {link.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          <Badge variant="outline" className="hidden sm:flex text-xs">
            Base Sepolia
          </Badge>

          {/* Base/Ethereum Wallet Button */}
          <div className="scale-90 md:scale-100">
            <ConnectButton
              showBalance={{
                smallScreen: false,
                largeScreen: false,
              }}
              chainStatus={{
                smallScreen: "icon",
                largeScreen: "full",
              }}
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
            />
          </div>

          {/* Mobile Menu - Simplified for now */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
