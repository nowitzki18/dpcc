"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrustPill } from "@/components/TrustPill"
import { Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { calculateTrustScore } from "@/lib/utils"

export default function TrustPage() {
  const { currentUser, reviews, reports } = useStore()

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Please sign in to view trust dashboard</p>
      </div>
    )
  }

  const userReviews = reviews.filter(r => r.userId === currentUser.id)
  const userReports = reports.filter(r => r.reporterId === currentUser.id)
  const reviewsAboutUser = reviews.filter(r => {
    // In a real app, this would check reports about the user's reviews
    return false
  })

  const averageTrustScore = userReviews.length > 0
    ? userReviews.reduce((sum, r) => sum + calculateTrustScore(r), 0) / userReviews.length
    : 50

  const integrityBreakdown = {
    low: userReviews.filter(r => r.integrityRisk === 'low').length,
    medium: userReviews.filter(r => r.integrityRisk === 'medium').length,
    high: userReviews.filter(r => r.integrityRisk === 'high').length,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Trust & Safety Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your review integrity and trust score
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Trust Score</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">{Math.round(averageTrustScore)}</div>
            <p className="text-sm text-muted-foreground">
              Based on {userReviews.length} reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <CardTitle>Verified Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {currentUser.verifiedReader ? (
              <Badge className="bg-green-500">Verified Reader</Badge>
            ) : (
              <Badge variant="outline">Not Verified</Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <CardTitle>Reports</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">{userReports.length}</div>
            <p className="text-sm text-muted-foreground">Reports submitted</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="integrity" className="space-y-6">
        <TabsList>
          <TabsTrigger value="integrity">Review Integrity</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="shadow-ban">Shadow Ban Log</TabsTrigger>
        </TabsList>

        <TabsContent value="integrity">
          <Card>
            <CardHeader>
              <CardTitle>Review Integrity Analysis</CardTitle>
              <CardDescription>
                Your reviews are analyzed for integrity and trustworthiness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{integrityBreakdown.low}</div>
                    <div className="text-sm text-muted-foreground">Low Risk</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{integrityBreakdown.medium}</div>
                    <div className="text-sm text-muted-foreground">Medium Risk</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{integrityBreakdown.high}</div>
                    <div className="text-sm text-muted-foreground">High Risk</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Your Reviews</h4>
                  {userReviews.length === 0 ? (
                    <p className="text-muted-foreground">No reviews yet</p>
                  ) : (
                    <div className="space-y-2">
                      {userReviews.map(review => (
                        <div key={review.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <TrustPill level={review.integrityRisk} />
                            <Badge variant="outline">{review.rating}/5</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {review.content}
                          </p>
                          {review.integrityReasons.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              <strong>Reasons:</strong> {review.integrityReasons.join(", ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Your Reports</CardTitle>
              <CardDescription>
                Track reports you've submitted
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userReports.length === 0 ? (
                <p className="text-muted-foreground">No reports submitted</p>
              ) : (
                <div className="space-y-2">
                  {userReports.map(report => (
                    <div key={report.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge>{report.type}</Badge>
                        <Badge variant={report.status === 'resolved' ? 'default' : 'secondary'}>
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm">{report.reason}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shadow-ban">
          <Card>
            <CardHeader>
              <CardTitle>Shadow Ban Status</CardTitle>
              <CardDescription>
                Reviews that have been hidden from public view
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userReviews.filter(r => r.shadowBanned).length === 0 ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <p>No shadow-banned reviews</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {userReviews.filter(r => r.shadowBanned).map(review => (
                    <div key={review.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <span className="font-semibold text-red-600">Shadow Banned</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {review.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Hidden on {new Date(review.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

