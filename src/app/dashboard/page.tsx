"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, TrendingUp, Clock, Flame, Book, Eye, Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { BookCover } from "@/components/BookCover"
import Link from "next/link"
import { ReadingStatus } from "@/lib/types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function DashboardPage() {
  const { currentUser, readingLogs, books, authors, goals, addReadingLog, updateReadingLog } = useStore()
  const { toast } = useToast()
  const [isLoggingOpen, setIsLoggingOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<string>("")
  const [progress, setProgress] = useState([0])
  const [pagesRead, setPagesRead] = useState("")
  const [status, setStatus] = useState<ReadingStatus>("reading")

  const userLogs = useMemo(() => {
    if (!currentUser) return []
    return readingLogs.filter(log => log.userId === currentUser.id)
  }, [currentUser, readingLogs])

  const stats = useMemo(() => {
    const readBooks = userLogs.filter(log => log.status === 'read')
    const readingBooks = userLogs.filter(log => log.status === 'reading')
    const wantBooks = userLogs.filter(log => log.status === 'want')
    const dnfBooks = userLogs.filter(log => log.status === 'dnf')

    const totalPages = readBooks.reduce((sum, log) => sum + log.pagesRead, 0)
    const totalTime = readBooks.reduce((sum, log) => sum + log.readingTimeMinutes, 0)
    const avgPagesPerDay = userLogs.length > 0
      ? userLogs.reduce((sum, log) => sum + log.pagesPerDay, 0) / userLogs.length
      : 0

    const currentGoal = goals.find(g => g.userId === currentUser?.id && g.year === new Date().getFullYear())
    const streak = currentGoal?.streak || 0

    return {
      totalBooks: readBooks.length,
      readingBooks: readingBooks.length,
      wantBooks: wantBooks.length,
      dnfBooks: dnfBooks.length,
      totalPages,
      totalHours: Math.round(totalTime / 60),
      avgPagesPerDay: Math.round(avgPagesPerDay),
      streak,
    }
  }, [userLogs, goals, currentUser])

  const bookshelfBooks = useMemo(() => {
    const bookMap = new Map()
    userLogs.forEach(log => {
      const book = books.find(b => b.id === log.bookId)
      if (book) {
        bookMap.set(book.id, {
          book,
          log,
        })
      }
    })
    return Array.from(bookMap.values())
  }, [userLogs, books])

  const readingData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    const monthlyData = months.map(month => ({ month, books: 0, pages: 0 }))

    userLogs.forEach(log => {
      // Count completed books with finishDate
      if (log.status === 'read' && log.finishDate) {
        const date = new Date(log.finishDate)
        // Include current year and previous year for better data visibility
        if (date.getFullYear() === currentYear || date.getFullYear() === currentYear - 1) {
          const monthIndex = date.getMonth()
          if (monthIndex >= 0 && monthIndex < 12) {
            monthlyData[monthIndex].books += 1
            monthlyData[monthIndex].pages += log.pagesRead || 0
          }
        }
      }
      // For currently reading books, show progress in current month
      else if (log.status === 'reading' && log.pagesRead > 0) {
        // Add pages to current month to show active reading
        monthlyData[currentMonth].pages += log.pagesRead || 0
      }
      // Also count books marked as read even without finishDate (set it to today)
      else if (log.status === 'read' && !log.finishDate && log.pagesRead > 0) {
        monthlyData[currentMonth].books += 1
        monthlyData[currentMonth].pages += log.pagesRead || 0
      }
    })

    return monthlyData
  }, [userLogs])

  const handleLogProgress = () => {
    if (!currentUser || !selectedBook) {
      toast({
        title: "Error",
        description: "Please select a book",
        variant: "destructive",
      })
      return
    }

    const book = books.find(b => b.id === selectedBook)
    if (!book) return

    const pagesReadNum = parseInt(pagesRead) || 0
    const progressPercent = (pagesReadNum / book.pages) * 100

    const existingLog = userLogs.find(l => l.bookId === selectedBook)

    if (existingLog) {
      const updates: any = {
        status,
        progress: Math.min(100, progressPercent),
        pagesRead: pagesReadNum,
        pagesPerDay: existingLog.pagesPerDay, // Keep existing average
      }
      
      // Set finishDate when marking as read
      if (status === 'read' && !existingLog.finishDate) {
        updates.finishDate = new Date().toISOString()
      }
      // Set startDate when marking as reading
      if (status === 'reading' && !existingLog.startDate) {
        updates.startDate = new Date().toISOString()
      }
      
      updateReadingLog(existingLog.id, updates)
      toast({
        title: "Progress updated!",
        description: `Updated reading progress for ${book.title}`,
      })
    } else {
      addReadingLog({
        id: `log-${Date.now()}`,
        userId: currentUser.id,
        bookId: selectedBook,
        status,
        progress: Math.min(100, progressPercent),
        pagesRead: pagesReadNum,
        pagesPerDay: 25, // Default
        readingTimeMinutes: 0,
        highlights: [],
        annotations: [],
        startDate: status === 'reading' ? new Date().toISOString() : undefined,
        finishDate: status === 'read' ? new Date().toISOString() : undefined,
      })
      toast({
        title: "Book added!",
        description: `Added ${book.title} to your bookshelf`,
      })
    }

    setIsLoggingOpen(false)
    setSelectedBook("")
    setProgress([0])
    setPagesRead("")
    setStatus("reading")
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Please sign in to view your dashboard</p>
        <Link href="/signup">
          <Button className="mt-4">Sign Up</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser.name}! Here&apos;s your reading overview.
          </p>
        </div>
        <Dialog open={isLoggingOpen} onOpenChange={setIsLoggingOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Log Progress
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Reading Progress</DialogTitle>
              <DialogDescription>
                Update your reading progress or add a new book to your shelf
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Book</Label>
                <Select value={selectedBook} onValueChange={setSelectedBook}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a book" />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map(book => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as ReadingStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="want">Want to Read</SelectItem>
                    <SelectItem value="reading">Currently Reading</SelectItem>
                    <SelectItem value="read">Finished Reading</SelectItem>
                    <SelectItem value="dnf">Did Not Finish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedBook && (
                <>
                  <div>
                    <Label>Pages Read</Label>
                    <Input
                      type="number"
                      value={pagesRead}
                      onChange={(e) => {
                        setPagesRead(e.target.value)
                        const book = books.find(b => b.id === selectedBook)
                        if (book) {
                          const pages = parseInt(e.target.value) || 0
                          setProgress([(pages / book.pages) * 100])
                        }
                      }}
                      placeholder="Enter pages read"
                    />
                  </div>
                  <div>
                    <Label>Progress: {progress[0].toFixed(0)}%</Label>
                    <Slider
                      value={progress}
                      onValueChange={(value) => {
                        setProgress(value)
                        const book = books.find(b => b.id === selectedBook)
                        if (book) {
                          setPagesRead(Math.round((value[0] / 100) * book.pages).toString())
                        }
                      }}
                      max={100}
                      step={1}
                    />
                  </div>
                </>
              )}
              <Button onClick={handleLogProgress} className="w-full">
                Save Progress
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Books Read</CardDescription>
            <CardTitle className="text-3xl">{stats.totalBooks}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>{stats.readingBooks} currently reading</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pages Read</CardDescription>
            <CardTitle className="text-3xl">{stats.totalPages.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>~{stats.avgPagesPerDay} pages/day</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Reading Time</CardDescription>
            <CardTitle className="text-3xl">{stats.totalHours}h</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Total hours</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Streak</CardDescription>
            <CardTitle className="text-3xl">{stats.streak}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Flame className="h-4 w-4 text-orange-500" />
              <span>days in a row</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reading Chart */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Reading Activity This Year</CardTitle>
            <CardDescription>Books and pages read by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={readingData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => {
                    if (name === 'books') return [value, 'Books']
                    if (name === 'pages') return [value.toLocaleString(), 'Pages']
                    return [value, name]
                  }}
                />
                <Bar dataKey="books" fill="#8884d8" name="Books" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pages" fill="#82ca9d" name="Pages" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookshelf Status</CardTitle>
            <CardDescription>Distribution of your reading</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Read</span>
                  <span className="text-sm text-muted-foreground">{stats.totalBooks}</span>
                </div>
                <Progress value={(stats.totalBooks / (stats.totalBooks + stats.readingBooks + stats.wantBooks || 1)) * 100} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Currently Reading</span>
                  <span className="text-sm text-muted-foreground">{stats.readingBooks}</span>
                </div>
                <Progress value={(stats.readingBooks / (stats.totalBooks + stats.readingBooks + stats.wantBooks || 1)) * 100} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Want to Read</span>
                  <span className="text-sm text-muted-foreground">{stats.wantBooks}</span>
                </div>
                <Progress value={(stats.wantBooks / (stats.totalBooks + stats.readingBooks + stats.wantBooks || 1)) * 100} />
              </div>
              {stats.dnfBooks > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Did Not Finish</span>
                    <span className="text-sm text-muted-foreground">{stats.dnfBooks}</span>
                  </div>
                  <Progress value={(stats.dnfBooks / (stats.totalBooks + stats.readingBooks + stats.wantBooks || 1)) * 100} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookshelf */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Bookshelf</CardTitle>
              <CardDescription>
                Books you&apos;re reading, have read, or want to read
              </CardDescription>
            </div>
            <Link href="/discover">
              <Button variant="outline">Discover More</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {bookshelfBooks.length === 0 ? (
            <div className="text-center py-12">
              <Book className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Your bookshelf is empty</p>
              <Link href="/discover">
                <Button>Start Discovering Books</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Currently Reading */}
              {bookshelfBooks.filter(({ log }) => log.status === 'reading').length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Currently Reading</h3>
                    <Badge variant="secondary">
                      {bookshelfBooks.filter(({ log }) => log.status === 'reading').length}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookshelfBooks
                      .filter(({ log }) => log.status === 'reading')
                      .map(({ book, log }) => (
                        <Card key={book.id} className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                                <CardDescription className="line-clamp-1">
                                  {authors.find(a => a.id === book.authorId)?.name || "Unknown Author"}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div>
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span>Progress</span>
                                  <span>{log.progress.toFixed(0)}%</span>
                                </div>
                                <Progress value={log.progress} />
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {log.pagesRead} / {book.pages} pages
                              </div>
                              <Link href={`/reader/${book.id}`}>
                                <Button variant="outline" size="sm" className="w-full">
                                  Continue Reading
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}

              {/* Read */}
              {bookshelfBooks.filter(({ log }) => log.status === 'read').length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold">Read</h3>
                    <Badge variant="secondary">
                      {bookshelfBooks.filter(({ log }) => log.status === 'read').length}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {bookshelfBooks
                      .filter(({ log }) => log.status === 'read')
                      .slice(0, 8)
                      .map(({ book, log }) => (
                        <Link key={book.id} href={`/book/${book.id}`}>
                          <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader>
                              <BookCover book={book} size="sm" className="mb-2" />
                              <CardTitle className="text-sm line-clamp-2">{book.title}</CardTitle>
                              <CardDescription className="text-xs line-clamp-1">
                                {authors.find(a => a.id === book.authorId)?.name || "Unknown"}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {log.finishDate && (
                                <p className="text-xs text-muted-foreground">
                                  Finished {new Date(log.finishDate).toLocaleDateString()}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                  </div>
                  {bookshelfBooks.filter(({ log }) => log.status === 'read').length > 8 && (
                    <div className="text-center mt-4">
                      <Link href="/goals">
                        <Button variant="outline">View All Read Books</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Want to Read */}
              {bookshelfBooks.filter(({ log }) => log.status === 'want').length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Book className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Want to Read</h3>
                    <Badge variant="secondary">
                      {bookshelfBooks.filter(({ log }) => log.status === 'want').length}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {bookshelfBooks
                      .filter(({ log }) => log.status === 'want')
                      .slice(0, 8)
                      .map(({ book }) => (
                        <Link key={book.id} href={`/book/${book.id}`}>
                          <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader>
                              <BookCover book={book} size="sm" className="mb-2" />
                              <CardTitle className="text-sm line-clamp-2">{book.title}</CardTitle>
                              <CardDescription className="text-xs line-clamp-1">
                                {authors.find(a => a.id === book.authorId)?.name || "Unknown"}
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

