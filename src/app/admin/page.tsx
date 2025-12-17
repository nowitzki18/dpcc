"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Shield, Users, BookOpen, Flag, TrendingUp } from "lucide-react"
import { useMemo } from "react"

export default function AdminPage() {
  const { currentUser, books, reviews, users, reports, resetDemoData } = useStore()

  const moderationQueue = reports.filter(r => r.status === 'pending')
  const shadowBannedReviews = reviews.filter(r => r.shadowBanned)

  const genreData = useMemo(() => {
    const counts: Record<string, number> = {}
    books.forEach(book => {
      book.genres.forEach(genre => {
        counts[genre] = (counts[genre] || 0) + 1
      })
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [books])

  const integrityData = useMemo(() => {
    const counts = {
      low: reviews.filter(r => r.integrityRisk === 'low').length,
      medium: reviews.filter(r => r.integrityRisk === 'medium').length,
      high: reviews.filter(r => r.integrityRisk === 'high').length,
    }
    return [
      { name: 'Low Risk', value: counts.low },
      { name: 'Medium Risk', value: counts.medium },
      { name: 'High Risk', value: counts.high },
    ]
  }, [reviews])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Admin access required</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Analytics and moderation tools
          </p>
        </div>
        <Button variant="outline" onClick={resetDemoData}>
          Reset Demo Data
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Books</CardDescription>
            <CardTitle className="text-3xl">{books.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Reviews</CardDescription>
            <CardTitle className="text-3xl">{reviews.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">{users.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Reports</CardDescription>
            <CardTitle className="text-3xl">{moderationQueue.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Books by Genre</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={genreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review Integrity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={integrityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {integrityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="moderation">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-primary" />
                  <CardTitle>Moderation Queue</CardTitle>
                </div>
                <CardDescription>
                  {moderationQueue.length} reports pending review
                </CardDescription>
              </CardHeader>
              <CardContent>
                {moderationQueue.length === 0 ? (
                  <p className="text-muted-foreground">No pending reports</p>
                ) : (
                  <div className="space-y-4">
                    {moderationQueue.map(report => (
                      <div key={report.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Badge className="mb-2">{report.type}</Badge>
                            <p className="font-semibold">{report.reason}</p>
                          </div>
                          <Badge variant="secondary">{report.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Reported on {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Review</Button>
                          <Button size="sm" variant="outline">Dismiss</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Shadow-Banned Reviews</CardTitle>
                </div>
                <CardDescription>
                  {shadowBannedReviews.length} reviews hidden from public view
                </CardDescription>
              </CardHeader>
              <CardContent>
                {shadowBannedReviews.length === 0 ? (
                  <p className="text-muted-foreground">No shadow-banned reviews</p>
                ) : (
                  <div className="space-y-2">
                    {shadowBannedReviews.map(review => (
                      <div key={review.id} className="p-3 border rounded-lg">
                        <p className="text-sm line-clamp-2">{review.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Review ID: {review.id} • Hidden on {new Date(review.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

