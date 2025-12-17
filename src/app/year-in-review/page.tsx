"use client"

import { useStore } from "@/lib/store"
import { ShareCard } from "@/components/ShareCard"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, TrendingUp, Clock, Star } from "lucide-react"
import { useMemo } from "react"

export default function YearInReviewPage() {
  const { currentUser, readingLogs, reviews, books } = useStore()

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Please sign in to view your year in review</p>
      </div>
    )
  }

  const year = new Date().getFullYear()
  const yearLogs = readingLogs.filter(log => {
    const logYear = log.finishDate ? new Date(log.finishDate).getFullYear() : new Date().getFullYear()
    return log.userId === currentUser.id && logYear === year && log.status === 'read'
  })

  const yearReviews = reviews.filter(r => {
    const reviewYear = new Date(r.createdAt).getFullYear()
    return r.userId === currentUser.id && reviewYear === year
  })

  const stats = useMemo(() => {
    const booksRead = yearLogs.length
    const pagesRead = yearLogs.reduce((sum, log) => sum + log.pagesRead, 0)
    const hoursRead = yearLogs.reduce((sum, log) => sum + log.readingTimeMinutes, 0) / 60
    
    const genreCounts: Record<string, number> = {}
    yearLogs.forEach(log => {
      const book = books.find(b => b.id === log.bookId)
      if (book) {
        book.genres.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1
        })
      }
    })
    const favoriteGenres = Object.entries(genreCounts)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)

    const avgRating = yearReviews.length > 0
      ? yearReviews.reduce((sum, r) => sum + r.rating, 0) / yearReviews.length
      : 0

    const topBooks = yearLogs
      .map(log => {
        const review = yearReviews.find(r => r.bookId === log.bookId)
        return {
          bookId: log.bookId,
          rating: review?.rating || 0,
        }
      })
      .filter(b => b.rating > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5)

    return {
      booksRead,
      pagesRead,
      hoursRead,
      favoriteGenres,
      averageRating: avgRating,
      topBooks,
    }
  }, [yearLogs, yearReviews, books])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your {year} in Review</h1>
        <p className="text-muted-foreground">
          Celebrate your reading journey this year
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <ShareCard title={`${currentUser.name}-${year}-reading-review`}>
          <div className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">{currentUser.name}'s {year} Reading Year</h2>
              <p className="text-muted-foreground">Powered by GreatReads</p>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold">{stats.booksRead}</div>
                <div className="text-sm text-muted-foreground">Books Read</div>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold">{stats.pagesRead.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Pages Read</div>
              </div>
              <div className="text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold">{Math.round(stats.hoursRead)}</div>
                <div className="text-sm text-muted-foreground">Hours Read</div>
              </div>
            </div>

            {stats.favoriteGenres.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Favorite Genres</h3>
                <div className="flex gap-2 justify-center">
                  {stats.favoriteGenres.map(({ genre, count }) => (
                    <div key={genre} className="px-4 py-2 bg-primary/20 rounded-full">
                      <div className="font-semibold">{genre}</div>
                      <div className="text-xs text-muted-foreground">{count} books</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats.averageRating > 0 && (
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground mt-8">
              Share your reading journey with #GreatReads{year}
            </div>
          </div>
        </ShareCard>
      </div>
    </div>
  )
}

