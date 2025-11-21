"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WalletIcon, KeyIcon, AlertCircleIcon } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username.trim()) {
      setError("Please enter your username")
      return
    }

    setIsLoading(true)

    try {
      // Simulate passkey authentication
      // In a real app, this would use the WebAuthn API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Check if user exists (in a real app, this would be handled by your backend)
      const existingUser = localStorage.getItem("wallet_user")

      if (!existingUser) {
        setError("Wallet not found. Please create a new wallet.")
        setIsLoading(false)
        return
      }

      const userData = JSON.parse(existingUser)

      if (userData.username !== username) {
        setError("Username not found. Please check and try again.")
        setIsLoading(false)
        return
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError("Failed to sign in. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center size-16 rounded-xl bg-primary text-primary-foreground">
            <WalletIcon className="size-8" />
          </div>
          <h1 className="text-2xl font-bold">Abstraction Wallet</h1>
        </div>

        {/* Sign In Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your wallet with passkey authentication</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircleIcon className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <KeyIcon className="mr-2" />
                    Sign In with Passkey
                  </>
                )}
              </Button>

              <div className="space-y-4 pt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Secure Authentication</span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground space-y-2 bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium text-foreground">Quick & Safe</p>
                  <p>
                    Use your device's biometric authentication to securely access your wallet. Your credentials never
                    leave your device.
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have a wallet? </span>
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Create one now
          </Link>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

