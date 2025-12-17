"use client"

import { useParams } from "next/navigation"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Download, Wifi, WifiOff } from "lucide-react"
import { useState } from "react"
import { estimateReadingTimeMinutes } from "@/lib/utils"

export default function ReaderPage() {
  const params = useParams()
  const { books, readingLogs, currentUser, updateReadingLog } = useStore()
  const bookId = params.id as string
  const [isOffline, setIsOffline] = useState(false)

  const book = books.find(b => b.id === bookId)
  const log = currentUser ? readingLogs.find(l => l.userId === currentUser.id && l.bookId === bookId) : null

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Book not found</p>
      </div>
    )
  }

  const progress = log?.progress || 0
  const pagesRead = log?.pagesRead || 0
  const estimatedTime = estimateReadingTimeMinutes(book.pages - pagesRead)

  const handleProgressChange = (value: number[]) => {
    if (!currentUser || !log) return
    const newProgress = value[0]
    const newPagesRead = Math.round((newProgress / 100) * book.pages)
    updateReadingLog(log.id, {
      progress: newProgress,
      pagesRead: newPagesRead,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
        <div className="flex items-center gap-2">
          <Badge>{book.genres[0]}</Badge>
          <span className="text-sm text-muted-foreground">
            {pagesRead} / {book.pages} pages
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reading Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{progress.toFixed(0)}%</div>
            <Progress value={progress} className="mb-4" />
            <Slider
              value={[progress]}
              onValueChange={handleProgressChange}
              max={100}
              step={1}
              disabled={!currentUser}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reading Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-semibold">{pagesRead} pages read</div>
                <div className="text-xs text-muted-foreground">{book.pages - pagesRead} remaining</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-semibold">~{Math.round(estimatedTime / 60)} hours left</div>
                <div className="text-xs text-muted-foreground">Estimated completion</div>
              </div>
            </div>
            {log && (
              <div className="text-xs text-muted-foreground">
                {log.pagesPerDay} pages/day average
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reader Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setIsOffline(!isOffline)}
            >
              {isOffline ? <WifiOff className="h-4 w-4 mr-2" /> : <Wifi className="h-4 w-4 mr-2" />}
              {isOffline ? "Go Online" : "Go Offline"}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Download for Offline
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Highlights & Annotations</CardTitle>
          <CardDescription>
            Your saved highlights and notes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {log && log.highlights.length > 0 ? (
            <div className="space-y-4">
              {log.highlights.map(highlight => (
                <div key={highlight.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">Page {highlight.page}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(highlight.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{highlight.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No highlights yet. Start reading to add highlights!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

