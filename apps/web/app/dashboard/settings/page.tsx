"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import {
  MoonIcon,
  SunIcon,
  MonitorIcon,
  CheckIcon,
  MailIcon,
  MessageSquareIcon,
  KeyIcon,
  GlobeIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState("en")
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [telegramNotifications, setTelegramNotifications] = useState(false)
  const [email, setEmail] = useState("")
  const [telegramUsername, setTelegramUsername] = useState("")
  const [recoveryEmail, setRecoveryEmail] = useState("")

  const handleSaveNotifications = () => {
    toast.success("Notification settings saved successfully")
  }

  const handleSaveRecovery = () => {
    toast.success("Recovery email updated successfully")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your wallet preferences and security</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how your wallet looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setTheme("light")}
                >
                  <SunIcon className="mr-2 size-4" />
                  Light
                  {theme === "light" && <CheckIcon className="ml-auto size-4" />}
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setTheme("dark")}
                >
                  <MoonIcon className="mr-2 size-4" />
                  Dark
                  {theme === "dark" && <CheckIcon className="ml-auto size-4" />}
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setTheme("system")}
                >
                  <MonitorIcon className="mr-2 size-4" />
                  System
                  {theme === "system" && <CheckIcon className="ml-auto size-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Language</CardTitle>
            <CardDescription>Choose your preferred language</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Display Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">
                    <div className="flex items-center gap-2">
                      <GlobeIcon className="size-4" />
                      English
                    </div>
                  </SelectItem>
                  <SelectItem value="es">
                    <div className="flex items-center gap-2">
                      <GlobeIcon className="size-4" />
                      Español
                    </div>
                  </SelectItem>
                  <SelectItem value="fr">
                    <div className="flex items-center gap-2">
                      <GlobeIcon className="size-4" />
                      Français
                    </div>
                  </SelectItem>
                  <SelectItem value="de">
                    <div className="flex items-center gap-2">
                      <GlobeIcon className="size-4" />
                      Deutsch
                    </div>
                  </SelectItem>
                  <SelectItem value="ja">
                    <div className="flex items-center gap-2">
                      <GlobeIcon className="size-4" />
                      日本語
                    </div>
                  </SelectItem>
                  <SelectItem value="zh">
                    <div className="flex items-center gap-2">
                      <GlobeIcon className="size-4" />
                      中文
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security & Recovery */}
        <Card>
          <CardHeader>
            <CardTitle>Security & Recovery</CardTitle>
            <CardDescription>Manage your wallet security and recovery options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Passkey Authentication</Label>
                  <p className="text-sm text-muted-foreground">Your wallet is secured with passkey</p>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <KeyIcon className="size-3" />
                  Active
                </Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="recovery-email">Recovery Email</Label>
                <p className="text-sm text-muted-foreground">
                  Add a recovery email to restore access if you lose your passkey
                </p>
                <div className="flex gap-2">
                  <Input
                    id="recovery-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                  />
                  <Button onClick={handleSaveRecovery}>Save</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive wallet notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Notifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <MailIcon className="size-4 text-muted-foreground" />
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Receive transaction alerts via email</p>
                </div>
                <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              {emailNotifications && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}
            </div>

            <Separator />

            {/* Telegram Notifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <MessageSquareIcon className="size-4 text-muted-foreground" />
                    <Label htmlFor="telegram-notifications">Telegram Notifications</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Get instant alerts on Telegram</p>
                </div>
                <Switch
                  id="telegram-notifications"
                  checked={telegramNotifications}
                  onCheckedChange={setTelegramNotifications}
                />
              </div>

              {telegramNotifications && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="telegram">Telegram Username</Label>
                  <Input
                    id="telegram"
                    type="text"
                    placeholder="@username"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Start a chat with @AbstractionWalletBot to receive notifications
                  </p>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Notification Types</Label>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-primary" />
                  <span>Incoming transactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-primary" />
                  <span>Outgoing transactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-primary" />
                  <span>Failed transactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-primary" />
                  <span>Security alerts</span>
                </div>
              </div>
            </div>

            <Button onClick={handleSaveNotifications} className="w-full">
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

