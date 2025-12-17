"use client"

import { useParams, useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, BookOpen, Clock, Share2, Flag } from "lucide-react"
import { ExplainabilityBadge } from "@/components/ExplainabilityBadge"
import { TrustPill } from "@/components/TrustPill"
import { BookCover } from "@/components/BookCover"
import { generateRecommendations } from "@/lib/recommendations"
import { estimateReadingTimeMinutes } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { currentUser, books, authors, reviews, readingLogs, addReadingLog, updateReadingLog, addReport } = useStore()
  const bookId = params.id as string
  
  const book = books.find(b => b.id === bookId)
  const author = book ? authors.find(a => a.id === book.authorId) : null
  const bookReviews = reviews.filter(r => r.bookId === bookId && !r.shadowBanned)
  const userLog = currentUser ? readingLogs.find(l => l.userId === currentUser.id && l.bookId === bookId) : null

  const [selectedStatus, setSelectedStatus] = useState<'want' | 'reading' | 'read' | 'dnf' | null>(
    userLog?.status || null
  )

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Book not found</p>
      </div>
    )
  }

  const handleStatusChange = (status: 'want' | 'reading' | 'read' | 'dnf') => {
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to track your reading",
      })
      return
    }

    setSelectedStatus(status)

    if (userLog) {
      updateReadingLog(userLog.id, { status, progress: status === 'read' ? 100 : status === 'dnf' ? 0 : userLog.progress })
    } else {
      addReadingLog({
        id: `log-${Date.now()}`,
        userId: currentUser.id,
        bookId: book.id,
        status,
        progress: status === 'read' ? 100 : 0,
        pagesRead: 0,
        pagesPerDay: 25,
        readingTimeMinutes: 0,
        highlights: [],
        annotations: [],
      })
    }

    toast({
      title: "Status updated",
      description: `Book marked as ${status}`,
    })
  }

  const handleReport = () => {
    if (!currentUser) return
    addReport({
      id: `report-${Date.now()}`,
      type: 'review-bombing',
      targetId: bookId,
      reporterId: currentUser.id,
      reason: 'Suspected review bombing',
      status: 'pending',
      createdAt: new Date().toISOString(),
    })
    toast({
      title: "Report submitted",
      description: "Thank you for helping keep our community safe",
    })
  }

  const readingTime = estimateReadingTimeMinutes(book.pages)
  const recommendation = currentUser ? generateRecommendations(currentUser, [book])[0] : null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-1">
          <BookCover book={book} size="lg" className="mb-4" />
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-semibold">{book.averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({book.reviewCount} reviews)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {book.genres.map(genre => (
                <Badge key={genre}>{genre}</Badge>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>~{Math.round(readingTime / 60)} hours to read</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {book.formats.map(format => (
                <Badge key={format} variant="outline">{format}</Badge>
              ))}
            </div>
            {currentUser && (
              <div className="space-y-2">
                <Button
                  variant={selectedStatus === 'want' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('want')}
                  className="w-full"
                >
                  Want to Read
                </Button>
                <Button
                  variant={selectedStatus === 'reading' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('reading')}
                  className="w-full"
                >
                  Currently Reading
                </Button>
                <Button
                  variant={selectedStatus === 'read' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('read')}
                  className="w-full"
                >
                  Mark as Read
                </Button>
                <Button
                  variant={selectedStatus === 'dnf' ? 'destructive' : 'outline'}
                  onClick={() => handleStatusChange('dnf')}
                  className="w-full"
                >
                  Did Not Finish
                </Button>
              </div>
            )}
            <Button variant="outline" className="w-full" onClick={handleReport}>
              <Flag className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-muted-foreground mb-4">
            by {author?.name || "Unknown Author"}
          </p>
          <p className="text-lg mb-6">{book.synopsis}</p>

          {recommendation && recommendation.signals.length > 0 && (
            <div className="mb-6">
              <ExplainabilityBadge signals={recommendation.signals} />
            </div>
          )}

          <Tabs defaultValue="reviews" className="mt-8">
            <TabsList>
              <TabsTrigger value="reviews">Reviews ({bookReviews.length})</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="reviews" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Reviews</h3>
                {currentUser && (
                  <Link href={`/review/${bookId}`}>
                    <Button>Write Review</Button>
                  </Link>
                )}
              </div>
              {bookReviews.length === 0 ? (
                <p className="text-muted-foreground">No reviews yet. Be the first!</p>
              ) : (
                <div className="space-y-4">
                  {bookReviews.map(review => {
                    const reviewer = currentUser?.id === review.userId ? currentUser : null
                    return (
                      <Card key={review.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold">{review.rating.toFixed(2)}</span>
                                {review.pinned && <Badge variant="outline">Pinned</Badge>}
                              </div>
                              {review.title && (
                                <CardTitle className="text-lg">{review.title}</CardTitle>
                              )}
                            </div>
                            <TrustPill
                              level={review.integrityRisk}
                              verified={review.verifiedPurchase || review.finishedReading}
                            />
                          </div>
                          <CardDescription>
                            {reviewer?.name || "Anonymous"} • {new Date(review.createdAt).toLocaleDateString()}
                            {review.verifiedPurchase && <Badge variant="outline" className="ml-2">Verified Purchase</Badge>}
                            {review.finishedReading && <Badge variant="outline" className="ml-2">Finished Reading</Badge>}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className={review.spoiler ? "blur-sm" : ""}>
                            {review.content}
                          </p>
                          {review.spoiler && (
                            <p className="text-xs text-muted-foreground mt-2">Contains spoilers</p>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
            <TabsContent value="details">
              <Card>
                <CardContent className="pt-6">
                  <dl className="space-y-4">
                    <div>
                      <dt className="font-semibold">Pages</dt>
                      <dd className="text-muted-foreground">{book.pages}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Published</dt>
                      <dd className="text-muted-foreground">{book.publishedYear}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Genres</dt>
                      <dd className="text-muted-foreground">{book.genres.join(", ")}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Moods</dt>
                      <dd className="text-muted-foreground">{book.moods.join(", ")}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Tags</dt>
                      <dd className="text-muted-foreground">{book.tags.join(", ")}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

