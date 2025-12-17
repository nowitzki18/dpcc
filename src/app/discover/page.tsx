"use client"

import { useStore } from "@/lib/store"
import { BookCard } from "@/components/BookCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { generateRecommendations } from "@/lib/recommendations"
import { useMemo, useState } from "react"
import { Sparkles, TrendingUp, BookOpen } from "lucide-react"

export default function DiscoverPage() {
  const { currentUser, books, authors, recommendations } = useStore()
  const [selectedGenre1, setSelectedGenre1] = useState<string>("")
  const [selectedGenre2, setSelectedGenre2] = useState<string>("")
  const [selectedMood, setSelectedMood] = useState<string>("")

  const userRecommendations = useMemo(() => {
    if (!currentUser) return []
    return generateRecommendations(currentUser, books)
  }, [currentUser, books])

  const genreBlendRecs = useMemo(() => {
    if (!selectedGenre1 || !selectedGenre2) return []
    return books.filter(book => 
      book.genres.includes(selectedGenre1 as any) && 
      book.genres.includes(selectedGenre2 as any) &&
      (!selectedMood || book.moods.includes(selectedMood as any))
    )
  }, [books, selectedGenre1, selectedGenre2, selectedMood])

  const newAuthorBooks = useMemo(() => {
    return books.filter(book => book.publishedYear >= 2023)
  }, [books])

  const getAuthorName = (authorId: string) => {
    return authors.find(a => a.id === authorId)?.name || "Unknown"
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Please sign up to discover personalized recommendations</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover</h1>
        <p className="text-muted-foreground">
          Personalized recommendations based on your preferences
        </p>
      </div>

      <Tabs defaultValue="personalized" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personalized">For You</TabsTrigger>
          <TabsTrigger value="genre-blend">Genre Blend</TabsTrigger>
          <TabsTrigger value="new-authors">New Authors</TabsTrigger>
        </TabsList>

        <TabsContent value="personalized" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>Personalized Recommendations</CardTitle>
              </div>
              <CardDescription>
                Books we think you&apos;ll love based on your preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userRecommendations.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Complete your preferences to get personalized recommendations
                </p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userRecommendations.slice(0, 12).map((rec) => {
                    const book = books.find(b => b.id === rec.bookId)
                    if (!book) return null
                    return (
                      <BookCard
                        key={rec.id}
                        book={book}
                        authorName={getAuthorName(book.authorId)}
                        showExplainability
                        recommendationSignals={rec.signals}
                      />
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-sm">Sponsored Discovery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                This is a sponsored recommendation. We clearly label all sponsored content.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.slice(0, 3).map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    authorName={getAuthorName(book.authorId)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="genre-blend" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Genre Blending</CardTitle>
              <CardDescription>
                Combine two genres and a mood to discover unique books
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Genre 1</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedGenre1}
                    onChange={(e) => setSelectedGenre1(e.target.value)}
                  >
                    <option value="">Select genre...</option>
                    {['fiction', 'mystery', 'sci-fi', 'fantasy', 'romance', 'thriller', 'historical'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Genre 2</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedGenre2}
                    onChange={(e) => setSelectedGenre2(e.target.value)}
                  >
                    <option value="">Select genre...</option>
                    {['fiction', 'mystery', 'sci-fi', 'fantasy', 'romance', 'thriller', 'historical'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Mood</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedMood}
                    onChange={(e) => setSelectedMood(e.target.value)}
                  >
                    <option value="">Any mood</option>
                    {['uplifting', 'thought-provoking', 'fast-paced', 'slow-burn', 'emotional', 'lighthearted'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              {genreBlendRecs.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {genreBlendRecs.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      authorName={getAuthorName(book.authorId)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new-authors" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle>New Author Spotlight</CardTitle>
              </div>
              <CardDescription>
                Discover books from recently published authors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newAuthorBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    authorName={getAuthorName(book.authorId)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

