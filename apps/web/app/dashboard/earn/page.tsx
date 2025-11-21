"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRightLeftIcon, WalletIcon, TrendingUpIcon, ClockIcon, ZapIcon } from "lucide-react"

export default function EarnPage() {
  const [amount, setAmount] = useState("1000")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Earn</h1>
        <p className="text-muted-foreground">Deposit your assets to earn yield through secure protocols.</p>
      </div>

      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <Tabs defaultValue="earn" className="w-full">
            <CardHeader className="pb-0">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="earn">Earn</TabsTrigger>
                <TabsTrigger value="manage">Manage</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="pt-6">
              <TabsContent value="earn" className="space-y-6 mt-0">
                {/* Network Selector */}
                <div className="flex items-center gap-2">
                  <Select defaultValue="ethereum">
                    <SelectTrigger className="w-fit h-8 gap-2 border-none bg-transparent px-0 hover:bg-transparent focus:ring-0 shadow-none font-medium">
                      <div className="flex items-center justify-center size-5 rounded-full bg-slate-200 dark:bg-slate-800">
                        <svg className="size-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                        </svg>
                      </div>
                      <SelectValue placeholder="Select Network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                      <SelectItem value="polygon">Polygon</SelectItem>
                      <SelectItem value="arbitrum">Arbitrum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Vault Section */}
                <div className="rounded-xl border bg-card p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Vault</span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <Select defaultValue="usdt">
                      <SelectTrigger className="w-[140px] border-none bg-transparent p-0 h-auto shadow-none focus:ring-0">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center size-8 rounded-full bg-emerald-500 text-white">
                            <span className="font-bold text-xs">T</span>
                          </div>
                          <span className="text-2xl font-semibold">USDT</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usdt">USDT</SelectItem>
                        <SelectItem value="usdc">USDC</SelectItem>
                        <SelectItem value="dai">DAI</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="text-right">
                      <Input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-right text-2xl font-semibold border-none bg-transparent p-0 h-auto shadow-none focus-visible:ring-0 text-red-500 w-[150px]"
                      />
                      <div className="text-sm text-muted-foreground">$998.864</div>
                    </div>
                  </div>

                  <div className="text-sm text-red-500 font-medium">Balance: 0 USDT</div>
                </div>

                {/* Earn Section */}
                <div className="rounded-xl border bg-muted/30 p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">Earn</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center size-6 rounded-full bg-blue-500 text-white">
                        <span className="font-bold text-xs">S</span>
                      </div>
                      <span className="text-lg font-semibold">USDT</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">6.42%</div>
                </div>

                {/* Info Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      You'll receive <span className="font-medium text-foreground">ysUSDT</span> via
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="size-4 rounded-full bg-blue-600"></div>
                      <span className="font-medium">Yearn Finance</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Yearly Earnings</span>
                    <span className="font-medium">64.2 USDT</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3 pt-2">
                  <div className="flex gap-3 text-sm text-muted-foreground">
                    <ArrowRightLeftIcon className="size-4 shrink-0 mt-0.5" />
                    <p>When you deposit USDT you'll receive ysUSDT. You can trade this liquid asset at any time</p>
                  </div>
                  <div className="flex gap-3 text-sm text-muted-foreground">
                    <ZapIcon className="size-4 shrink-0 mt-0.5" />
                    <p>Earned yield is updated each block and accrues automatically</p>
                  </div>
                  <div className="flex gap-3 text-sm text-muted-foreground">
                    <ClockIcon className="size-4 shrink-0 mt-0.5" />
                    <p>When withdrawing, your assets will be available immediately</p>
                  </div>
                </div>

                <Button className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white">Deposit</Button>

                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <span>Powered by</span>
                  <span className="font-semibold text-foreground">Yield.xyz</span>
                  <TrendingUpIcon className="size-3" />
                </div>
              </TabsContent>

              <TabsContent value="manage" className="mt-0">
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="p-4 rounded-full bg-muted">
                    <WalletIcon className="size-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">No Active Deposits</h3>
                    <p className="text-sm text-muted-foreground max-w-[200px]">
                      You don't have any active deposits to manage yet.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() =>
                      document
                        .querySelector('[value="earn"]')
                        ?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
                    }
                  >
                    Start Earning
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="mt-0">
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="p-4 rounded-full bg-muted">
                    <History className="size-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">No Activity Yet</h3>
                    <p className="text-sm text-muted-foreground max-w-[200px]">
                      Your earning history will appear here once you start depositing.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

function History({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  )
}

