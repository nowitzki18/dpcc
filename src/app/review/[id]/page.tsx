"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RatingInput } from "@/components/RatingInput"
import { analyzeReviewIntegrity } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export default function ReviewPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { currentUser, books, reviews, addReview } = useStore()
  const bookId = params.id as string

  const book = books.find(b => b.id === bookId)
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [spoiler, setSpoiler] = useState(false)
  const [verifiedPurchase, setVerifiedPurchase] = useState(false)
  const [finishedReading, setFinishedReading] = useState(false)

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Book not found</p>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Please sign in to write a review</p>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide a rating",
        variant: "destructive",
      })
      return
    }

    if (content.length < 50) {
      toast({
        title: "Review too short",
        description: "Please write at least 50 characters",
        variant: "destructive",
      })
      return
    }

    const integrity = analyzeReviewIntegrity(
      { content, rating, createdAt: new Date().toISOString(), userId: currentUser.id },
      reviews
    )

    const newReview = {
      id: `review-${Date.now()}`,
      bookId,
      userId: currentUser.id,
      rating,
      title: title || undefined,
      content,
      spoiler,
      verifiedPurchase,
      finishedReading,
      helpfulCount: 0,
      reportCount: 0,
      integrityRisk: integrity.risk,
      integrityReasons: integrity.reasons,
      pinned: false,
      shadowBanned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    addReview(newReview)
    toast({
      title: "Review submitted!",
      description: "Thank you for sharing your thoughts",
    })
    router.push(`/book/${bookId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
          <CardDescription>
            Share your thoughts about &quot;{book.title}&quot;
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Rating</Label>
              <RatingInput value={rating} onChange={setRating} />
            </div>

            <div>
              <Label htmlFor="title">Review Title (optional)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your review in a few words"
              />
            </div>

            <div>
              <Label htmlFor="content">Review</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts about this book..."
                rows={8}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {content.length} characters (minimum 50)
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="spoiler"
                  checked={spoiler}
                  onCheckedChange={(checked) => setSpoiler(checked as boolean)}
                />
                <Label htmlFor="spoiler" className="cursor-pointer">
                  Contains spoilers
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={verifiedPurchase}
                  onCheckedChange={(checked) => setVerifiedPurchase(checked as boolean)}
                />
                <Label htmlFor="verified" className="cursor-pointer">
                  Verified purchase
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="finished"
                  checked={finishedReading}
                  onCheckedChange={(checked) => setFinishedReading(checked as boolean)}
                />
                <Label htmlFor="finished" className="cursor-pointer">
                  Finished reading this book
                </Label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Submit Review
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

