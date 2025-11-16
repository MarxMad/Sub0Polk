"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePolkadot } from "@/components/providers/polkadot-provider";
import { formatPolkadotAddress } from "@/lib/polkadot";
import { Loader2 } from "lucide-react";

export function PolkadotConnectButton() {
  const {
    isConnected,
    isConnecting,
    selectedAccount,
    accounts,
    error,
    connect,
    disconnect,
    selectAccount,
  } = usePolkadot();

  if (isConnecting) {
    return (
      <Button disabled variant="outline" size="sm">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (!isConnected || !selectedAccount) {
    return (
      <div className="flex flex-col gap-2">
        <Button onClick={connect} variant="outline" size="sm">
          Connect Polkadot
        </Button>
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="hidden sm:inline">
              {formatPolkadotAddress(selectedAccount.address, 4)}
            </span>
            <span className="sm:hidden">
              {formatPolkadotAddress(selectedAccount.address, 3)}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              {selectedAccount.meta.name || "Account"}
            </span>
            <span className="text-xs font-mono">
              {formatPolkadotAddress(selectedAccount.address, 6)}
            </span>
          </div>
        </DropdownMenuLabel>

        {accounts.length > 1 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Switch Account
            </DropdownMenuLabel>
            {accounts.map((account) => (
              <DropdownMenuItem
                key={account.address}
                onClick={() => selectAccount(account)}
                className="cursor-pointer"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xs">
                    {account.meta.name || "Unnamed"}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {formatPolkadotAddress(account.address, 4)}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnect} className="cursor-pointer text-destructive">
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
