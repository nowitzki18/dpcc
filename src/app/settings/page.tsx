"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { UserRole } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const { currentUser, setCurrentUser } = useStore()
  const { toast } = useToast()

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Please sign in to view settings</p>
      </div>
    )
  }

  const handleRoleChange = (role: UserRole) => {
    setCurrentUser({ ...currentUser, role })
    toast({
      title: "Role updated",
      description: `Your role has been changed to ${role}`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="sync">Sync</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Name</Label>
                <p className="text-sm text-muted-foreground">{currentUser.name}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              </div>
              <div>
                <Label>Role</Label>
                <Select value={currentUser.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reader">Reader</SelectItem>
                    <SelectItem value="reviewer">Reviewer</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Trust Score</Label>
                <p className="text-sm text-muted-foreground">{currentUser.trustScore}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Family Plan</CardTitle>
                <CardDescription>
                  Share GreatReads with your family
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">$9.99<span className="text-lg font-normal">/month</span></div>
                <ul className="space-y-2 mb-4">
                  <li className="text-sm">• Up to 6 family members</li>
                  <li className="text-sm">• Shared reading lists</li>
                  <li className="text-sm">• Family reading challenges</li>
                </ul>
                <Button className="w-full">Upgrade to Family</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Plan</CardTitle>
                <CardDescription>
                  Special pricing for students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">$4.99<span className="text-lg font-normal">/month</span></div>
                <ul className="space-y-2 mb-4">
                  <li className="text-sm">• All premium features</li>
                  <li className="text-sm">• Ad-free experience</li>
                  <li className="text-sm">• Student verification required</li>
                </ul>
                <Button className="w-full" variant="outline">Upgrade to Student</Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Ad-Free Experience</CardTitle>
              <CardDescription>
                Remove all sponsored content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Checkbox id="ad-free" />
                <Label htmlFor="ad-free" className="cursor-pointer">
                  Enable ad-free experience ($4.99/month)
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync">
          <Card>
            <CardHeader>
              <CardTitle>Cross-Device Sync</CardTitle>
              <CardDescription>
                Sync your reading data across devices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="sync" defaultChecked />
                <Label htmlFor="sync" className="cursor-pointer">
                  Enable cross-device sync
                </Label>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Export Data</Button>
                <Button variant="outline">Import Data</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Export your reading data as JSON for backup or transfer
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>
                Access your reading data via API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>API Key</Label>
                <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded mt-1">
                  gr_api_{currentUser.id.substring(0, 8)}...
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Generate New Key</Button>
                <Button variant="outline">View Documentation</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                API access allows you to integrate GreatReads with other applications
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

