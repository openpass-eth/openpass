"use client"

import { useState, use } from "react"
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowRightLeft, 
  TrendingUp, 
  TrendingDown, 
  Settings, 
  Star, 
  Share2, 
  Flag,
  Wallet,
  Info,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data based on symbol
const getTokenData = (symbol: string) => {
  const s = symbol.toUpperCase()
  if (s === "ETH") {
    return {
      name: "Ethereum",
      symbol: "ETH",
      price: 2744.00,
      change24h: -2.0,
      equity: 3847.22,
      balance: 1.402,
      avgCost: 3513.34,
      pnl: -1.9,
      pnlValue: -75.71,
      icon: "/ethereum-abstract.png"
    }
  }
  return {
    name: s,
    symbol: s,
    price: 100.00,
    change24h: 5.0,
    equity: 0,
    balance: 0,
    avgCost: 0,
    pnl: 0,
    pnlValue: 0,
    icon: "/placeholder.svg"
  }
}

export default function TokenDetailsPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = use(params)
  const token = getTokenData(symbol)
  const [timeRange, setTimeRange] = useState("1D")
  const [swapAmount, setSwapAmount] = useState("")

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-12 border-2 border-background shadow-sm">
            <AvatarImage src={token.icon} alt={token.name} />
            <AvatarFallback>{token.symbol[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{token.name}</h1>
              <Badge variant="secondary" className="font-mono text-xs">{token.symbol}</Badge>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-3xl font-bold">${token.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <Badge variant={token.change24h >= 0 ? "default" : "destructive"} className={token.change24h >= 0 ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}>
                {token.change24h >= 0 ? "+" : ""}{token.change24h}%
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="icon" className="rounded-full">
             <Share2 className="size-4" />
           </Button>
           <Button variant="outline" size="icon" className="rounded-full">
             <Star className="size-4" />
           </Button>
           <Button variant="outline" size="icon" className="rounded-full">
             <Flag className="size-4" />
           </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Chart & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Card */}
          <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
               <div className="space-y-1">
                 <CardTitle>Price Chart</CardTitle>
                 <CardDescription>Historical price performance</CardDescription>
               </div>
               <div className="flex bg-muted/50 rounded-lg p-1">
                 {["1H", "1D", "1W", "1M", "1Y"].map((range) => (
                   <button
                     key={range}
                     onClick={() => setTimeRange(range)}
                     className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                       timeRange === range 
                         ? "bg-background shadow-sm text-foreground" 
                         : "text-muted-foreground hover:text-foreground"
                     }`}
                   >
                     {range}
                   </button>
                 ))}
               </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full flex items-end justify-center relative overflow-hidden pt-8">
                 {/* Mock Chart SVG */}
                 <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={token.change24h >= 0 ? "#22c55e" : "#ef4444"} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={token.change24h >= 0 ? "#22c55e" : "#ef4444"} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M0,35 C10,35 15,20 25,25 C35,30 40,10 50,15 C60,20 65,5 75,10 C85,15 90,0 100,5 L100,40 L0,40 Z" 
                      fill="url(#gradient)" 
                    />
                    <path 
                      d="M0,35 C10,35 15,20 25,25 C35,30 40,10 50,15 C60,20 65,5 75,10 C85,15 90,0 100,5" 
                      fill="none" 
                      stroke={token.change24h >= 0 ? "#22c55e" : "#ef4444"} 
                      strokeWidth="0.5" 
                      vectorEffect="non-scaling-stroke"
                    />
                 </svg>
                 
                 {/* Price Label Overlay */}
                 <div className="absolute right-0 top-10 text-xs text-muted-foreground border-b border-dashed border-muted-foreground/30 w-full text-right pr-2 pb-1">
                    ${(token.price * 1.05).toLocaleString()}
                 </div>
                 <div className="absolute right-0 bottom-10 text-xs text-muted-foreground border-b border-dashed border-muted-foreground/30 w-full text-right pr-2 pb-1">
                    ${(token.price * 0.95).toLocaleString()}
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
             <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4">
                   <div className="flex justify-between items-start">
                      <div>
                         <p className="text-sm text-muted-foreground font-medium">Your Equity</p>
                         <h3 className="text-2xl font-bold mt-1">${token.equity.toLocaleString()}</h3>
                         <p className="text-sm text-muted-foreground">{token.balance} {token.symbol}</p>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                         <Wallet className="size-5" />
                      </div>
                   </div>
                   <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-full" />
                   </div>
                </CardContent>
             </Card>

             <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 grid grid-cols-2 gap-y-6">
                   <div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                         Profit/Loss <Info className="size-3" />
                      </div>
                      <div className={token.pnl >= 0 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                         {token.pnl >= 0 ? "+" : ""}{token.pnl}% (${Math.abs(token.pnlValue)})
                      </div>
                   </div>
                   <div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                         Avg. Cost <Info className="size-3" />
                      </div>
                      <div className="font-semibold">
                         ${token.avgCost.toLocaleString()}
                      </div>
                   </div>
                   <div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                         24h Return
                      </div>
                      <div className={token.change24h >= 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                         {token.change24h >= 0 ? "+" : ""}{token.change24h}%
                      </div>
                   </div>

                </CardContent>
             </Card>
          </div>
        </div>

        {/* Sidebar - Swap Widget */}
        <div className="space-y-6">
           <Card className="border-none shadow-xl bg-card ring-1 ring-border/50">
              <CardHeader className="pb-3">
                 <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Trade {token.symbol}</CardTitle>
                    <Button variant="ghost" size="icon" className="size-8">
                       <Settings className="size-4" />
                    </Button>
                 </div>
              </CardHeader>
              <CardContent className="space-y-4">
                 {/* Pay Section */}
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                       <span>Pay with</span>
                       <div className="flex gap-2">
                          <span className="cursor-pointer hover:text-primary">30%</span>
                          <span className="cursor-pointer hover:text-primary">50%</span>
                          <span className="cursor-pointer hover:text-primary">Max</span>
                       </div>
                    </div>
                    <div className="flex gap-2 p-3 bg-muted/30 rounded-xl border border-transparent focus-within:border-primary/20 transition-all">
                       <div className="flex-1">
                          <Select defaultValue={token.symbol}>
                             <SelectTrigger className="h-8 w-fit gap-2 border-none bg-transparent p-0 focus:ring-0 shadow-none">
                                <div className="flex items-center gap-2">
                                   <Avatar className="size-5">
                                      <AvatarImage src={token.icon} />
                                      <AvatarFallback>{token.symbol[0]}</AvatarFallback>
                                   </Avatar>
                                   <span className="font-bold">{token.symbol}</span>
                                </div>
                             </SelectTrigger>
                             <SelectContent>
                                <SelectItem value={token.symbol}>{token.symbol}</SelectItem>
                             </SelectContent>
                          </Select>
                          <div className="text-xs text-muted-foreground mt-1 pl-1">Balance: {token.balance}</div>
                       </div>
                       <Input 
                          type="number" 
                          placeholder="0" 
                          className="text-right text-lg font-bold border-none bg-transparent shadow-none p-0 h-auto w-[100px] focus-visible:ring-0"
                          value={swapAmount}
                          onChange={(e) => setSwapAmount(e.target.value)}
                       />
                    </div>
                 </div>

                 {/* Swap Arrow */}
                 <div className="flex justify-center -my-2 relative z-10">
                    <div className="bg-background rounded-full p-1 border shadow-sm">
                       <ArrowDownLeft className="size-4 text-muted-foreground" />
                    </div>
                 </div>

                 {/* Receive Section */}
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                       <span>Receive</span>
                    </div>
                    <div className="flex gap-2 p-3 bg-muted/30 rounded-xl border border-transparent">
                       <div className="flex-1">
                          <Select defaultValue="USDT">
                             <SelectTrigger className="h-8 w-fit gap-2 border-none bg-transparent p-0 focus:ring-0 shadow-none">
                                <div className="flex items-center gap-2">
                                   <div className="size-5 rounded-full bg-green-500 flex items-center justify-center text-[8px] text-white font-bold">T</div>
                                   <span className="font-bold">USDT</span>
                                </div>
                             </SelectTrigger>
                             <SelectContent>
                                <SelectItem value="USDT">USDT</SelectItem>
                                <SelectItem value="USDC">USDC</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>
                       <div className="text-right text-lg font-bold text-muted-foreground w-[100px]">
                          {swapAmount ? (parseFloat(swapAmount) * token.price).toFixed(2) : "0"}
                       </div>
                    </div>
                 </div>

                 <Button className="w-full h-12 text-base font-semibold mt-2" size="lg">
                    Enter Amount
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
