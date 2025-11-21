"use client"

import { useState } from "react"
import { ArrowDownIcon, SettingsIcon, InfoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"

const tokens = [
  { symbol: "ETH", name: "Ethereum", balance: "2.5", price: 2500, icon: "/ethereum-abstract.png" },
  { symbol: "USDC", name: "USD Coin", balance: "5000", price: 1, icon: "/usdc-coins.png" },
  { symbol: "MATIC", name: "Polygon", balance: "1500", price: 0.85, icon: "/abstract-polygon.png" },
  { symbol: "ARB", name: "Arbitrum", balance: "800", price: 1.2, icon: "/arbitrum-abstract.png" },
]

export default function SwapPage() {
  const [fromToken, setFromToken] = useState("ETH")
  const [toToken, setToToken] = useState("USDC")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [slippage, setSlippage] = useState(0.5)

  const fromTokenData = tokens.find((t) => t.symbol === fromToken)
  const toTokenData = tokens.find((t) => t.symbol === toToken)

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    if (value && fromTokenData && toTokenData) {
      const calculatedAmount = (Number.parseFloat(value) * fromTokenData.price) / toTokenData.price
      setToAmount(calculatedAmount.toFixed(6))
    } else {
      setToAmount("")
    }
  }

  const handleSwapTokens = () => {
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)
    const tempAmount = fromAmount
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const handleMaxAmount = () => {
    if (fromTokenData) {
      handleFromAmountChange(fromTokenData.balance)
    }
  }

  const exchangeRate = fromTokenData && toTokenData ? (fromTokenData.price / toTokenData.price).toFixed(6) : "0"
  const estimatedGasFee = "0.0023"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Swap Tokens</h1>
        <p className="text-muted-foreground">Exchange your tokens instantly at the best rates</p>
      </div>

      <div className="max-w-xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Swap</CardTitle>
                <CardDescription>Trade tokens in your wallet</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <SettingsIcon className="size-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Swap Settings</DialogTitle>
                    <DialogDescription>Adjust your swap preferences</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Slippage Tolerance</Label>
                        <span className="text-sm font-medium">{slippage}%</span>
                      </div>
                      <Slider
                        value={[slippage]}
                        onValueChange={(value) => setSlippage(value[0])}
                        min={0.1}
                        max={5}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSlippage(0.5)}>
                          0.5%
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setSlippage(1)}>
                          1%
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setSlippage(3)}>
                          3%
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* From Token */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>From</Label>
                <span className="text-sm text-muted-foreground">
                  Balance: {fromTokenData?.balance} {fromToken}
                </span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    className="text-2xl h-14"
                  />
                </div>
                <Select value={fromToken} onValueChange={setFromToken}>
                  <SelectTrigger className="w-[140px] h-14">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        <div className="flex items-center gap-2">
                          <img
                            src={token.icon || "/placeholder.svg"}
                            alt={token.name}
                            className="size-5 rounded-full"
                          />
                          <span>{token.symbol}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="link" size="sm" onClick={handleMaxAmount} className="h-auto p-0">
                Max Amount
              </Button>
            </div>

            {/* Swap Direction Button */}
            <div className="flex justify-center">
              <Button variant="outline" size="icon" onClick={handleSwapTokens} className="rounded-full bg-transparent">
                <ArrowDownIcon className="size-4" />
              </Button>
            </div>

            {/* To Token */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>To</Label>
                <span className="text-sm text-muted-foreground">
                  Balance: {toTokenData?.balance} {toToken}
                </span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input type="number" placeholder="0.0" value={toAmount} readOnly className="text-2xl h-14 bg-muted" />
                </div>
                <Select value={toToken} onValueChange={setToToken}>
                  <SelectTrigger className="w-[140px] h-14">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        <div className="flex items-center gap-2">
                          <img
                            src={token.icon || "/placeholder.svg"}
                            alt={token.name}
                            className="size-5 rounded-full"
                          />
                          <span>{token.symbol}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Swap Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Exchange Rate</span>
                <span className="font-medium">
                  1 {fromToken} = {exchangeRate} {toToken}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Network Fee</span>
                <span className="font-medium">{estimatedGasFee} ETH</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Slippage Tolerance</span>
                  <InfoIcon className="size-3 text-muted-foreground" />
                </div>
                <Badge variant="secondary">{slippage}%</Badge>
              </div>
            </div>

            <Button className="w-full" size="lg" disabled={!fromAmount || Number.parseFloat(fromAmount) <= 0}>
              {!fromAmount || Number.parseFloat(fromAmount) <= 0 ? "Enter Amount" : "Swap Tokens"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By swapping, you agree to our terms of service and acknowledge the risks involved in trading
              cryptocurrencies.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

