"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Send, AlertCircle, CheckCircle2, Wallet } from "lucide-react"
import Link from "next/link"

// Mock tokens for selection
const tokens = [
  { id: "eth", symbol: "ETH", name: "Ethereum", balance: "2.5" },
  { id: "usdc", symbol: "USDC", name: "USD Coin", balance: "1500.00" },
  { id: "matic", symbol: "MATIC", name: "Polygon", balance: "850.00" },
  { id: "arb", symbol: "ARB", name: "Arbitrum", balance: "320.00" },
]

export default function SendPage() {
  const router = useRouter()
  const [step, setStep] = useState<"input" | "confirm" | "success">("input")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    recipient: "",
    amount: "",
    token: "eth",
  })

  const selectedToken = tokens.find((t) => t.id === formData.token)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.recipient || !formData.amount) return
    setStep("confirm")
  }

  const handleSend = async () => {
    setIsLoading(true)
    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setStep("success")
  }

  const resetForm = () => {
    setFormData({ recipient: "", amount: "", token: "eth" })
    setStep("input")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/dashboard">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send Assets</CardTitle>
          <CardDescription>Transfer tokens securely to another wallet address</CardDescription>
        </CardHeader>

        {step === "input" && (
          <form onSubmit={handleReview}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="token">Select Asset</Label>
                <Select value={formData.token} onValueChange={(value) => handleInputChange("token", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.id} value={token.id}>
                        <div className="flex items-center justify-between w-full gap-4">
                          <span className="font-medium">{token.symbol}</span>
                          <span className="text-muted-foreground text-xs">Balance: {token.balance}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Address</Label>
                <div className="relative">
                  <Input
                    id="recipient"
                    placeholder="0x..."
                    value={formData.recipient}
                    onChange={(e) => handleInputChange("recipient", e.target.value)}
                    className="pl-10 font-mono"
                  />
                  <Wallet className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    className="pr-16"
                    step="any"
                    min="0"
                  />
                  <div className="absolute right-3 top-2.5 text-sm font-medium text-muted-foreground">
                    {selectedToken?.symbol}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    Available: {selectedToken?.balance} {selectedToken?.symbol}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleInputChange("amount", selectedToken?.balance || "0")}
                    className="text-primary hover:underline"
                  >
                    Max Amount
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" size="lg">
                Review Transaction
              </Button>
            </CardFooter>
          </form>
        )}

        {step === "confirm" && (
          <>
            <CardContent className="space-y-6 pt-6">
              <Alert>
                <AlertCircle className="size-4" />
                <AlertDescription>
                  Please review the transaction details carefully. Transactions cannot be reversed.
                </AlertDescription>
              </Alert>

              <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Asset</span>
                  <span className="font-medium">
                    {selectedToken?.name} ({selectedToken?.symbol})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Recipient</span>
                  <span className="font-mono text-sm truncate max-w-[200px]">{formData.recipient}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="text-xl font-bold">
                    {formData.amount} {selectedToken?.symbol}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Network Fee</span>
                  <span className="text-sm">~0.0004 ETH</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep("input")}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleSend} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 size-4" />
                    Confirm Send
                  </>
                )}
              </Button>
            </CardFooter>
          </>
        )}

        {step === "success" && (
          <div className="text-center py-6">
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                  <CheckCircle2 className="size-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Transaction Sent!</h3>
                <p className="text-muted-foreground">
                  Your transaction has been successfully submitted to the network.
                </p>
              </div>
              <div className="rounded-lg border p-4 bg-muted/30 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-green-600 font-medium">Processing</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction Hash</span>
                  <span className="font-mono text-xs">0x8f...3a2b</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button className="w-full" onClick={resetForm}>
                Send Another Transaction
              </Button>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
            </CardFooter>
          </div>
        )}
      </Card>
    </div>
  )
}

