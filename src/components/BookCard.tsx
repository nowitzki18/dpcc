"use client"

import Link from "next/link"
import { Book } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { BookCover } from "@/components/BookCover"

interface BookCardProps {
  book: Book
  authorName?: string
  showExplainability?: boolean
  recommendationSignals?: Array<{ type: string; description: string }>
  className?: string
}

export function BookCard({ book, authorName, showExplainability, recommendationSignals, className }: BookCardProps) {
  return (
    <Link href={`/book/${book.id}`}>
      <Card className={cn("hover:shadow-lg transition-shadow cursor-pointer h-full", className)}>
        <CardHeader>
          <BookCover book={book} size="md" className="mb-4" />
          <CardTitle className="line-clamp-2">{book.title}</CardTitle>
          <CardDescription>{authorName || "Unknown Author"}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {book.synopsis}
          </p>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-sm font-medium">{book.averageRating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({book.reviewCount} reviews)
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {book.genres.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
          {showExplainability && recommendationSignals && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs font-semibold mb-2">Top 3 reasons:</p>
              <ul className="space-y-1">
                {recommendationSignals.slice(0, 3).map((signal, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground">
                    {idx + 1}. {signal.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          {book.pages} pages • {book.publishedYear}
        </CardFooter>
      </Card>
    </Link>
  )
}

