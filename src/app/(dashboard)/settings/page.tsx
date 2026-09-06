import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogoutButton } from "@/components/settings/logout-button"
import { auth } from "@/lib/auth"
import { User, Shield, Palette } from "lucide-react"

export default async function SettingsPage() {
  const session = await auth()
  const user = session?.user

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "TK"

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account profile, appearance, and active session.
        </p>
      </div>

      {/* User Account Profile */}
      <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" />
            <CardTitle className="text-base">User Profile</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Your personal details associated with your Tasko account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/40">
            <Avatar className="h-14 w-14 rounded-2xl border border-border/60 shadow-sm">
              <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
              <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-base rounded-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm text-foreground">{user?.name || "Demo User"}</h3>
                <Badge
                  variant="outline"
                  className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 uppercase"
                >
                  {(user as { role?: string })?.role || "Member"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">{user?.email || "demo@tasko.dev"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-violet-500" />
            <CardTitle className="text-base">Appearance</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Customize the look and feel of your Tasko experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-sm font-medium">Theme Mode</Label>
              <p className="text-xs text-muted-foreground">Switch between Light, Dark, or System theme</p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {/* Security & Session */}
      <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-500" />
            <CardTitle className="text-base">Session & Security</CardTitle>
          </div>
          <CardDescription className="text-xs">
            End your current active session across this device.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
            <div>
              <h4 className="text-xs font-semibold text-foreground">Sign Out</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                You will be redirected back to the login screen.
              </p>
            </div>
            <LogoutButton />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
