"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MapPin, Calendar, MessageSquare, BookOpen } from "lucide-react"
import Link from "next/link"

export default function CommunityPage() {
  const { clubs, threads, books, authors } = useStore()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community</h1>
        <p className="text-muted-foreground">
          Join book clubs, discuss books, and connect with authors
        </p>
      </div>

      <Tabs defaultValue="clubs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="clubs">Book Clubs</TabsTrigger>
          <TabsTrigger value="threads">Discussion Threads</TabsTrigger>
          <TabsTrigger value="authors">Author Q&A</TabsTrigger>
        </TabsList>

        <TabsContent value="clubs" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map(club => (
              <Card key={club.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardTitle>{club.name}</CardTitle>
                  <CardDescription>{club.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{club.memberCount} members</span>
                    </div>
                    {club.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{club.location}</span>
                        {club.distance && <span>({club.distance.toFixed(1)} km away)</span>}
                      </div>
                    )}
                    <Badge>{club.genre}</Badge>
                  </div>
                  {club.events.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-2">Upcoming Events</p>
                      {club.events.slice(0, 2).map(event => (
                        <div key={event.id} className="text-sm text-muted-foreground mb-1">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {event.title} - {new Date(event.date).toLocaleDateString()}
                        </div>
                      ))}
                    </div>
                  )}
                  <Button className="w-full">Join Club</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="threads" className="space-y-4">
          {threads.map(thread => {
            const book = thread.bookId ? books.find(b => b.id === thread.bookId) : null
            const club = thread.clubId ? clubs.find(c => c.id === thread.clubId) : null
            
            return (
              <Card key={thread.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{thread.title}</CardTitle>
                        {thread.pinned && <Badge variant="outline">Pinned</Badge>}
                      </div>
                      <CardDescription>
                        {book && `Discussion about "${book.title}"`}
                        {club && ` • In ${club.name}`}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4 line-clamp-3">{thread.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>{thread.replyCount} replies</span>
                    </div>
                    <Button variant="outline" size="sm">View Thread</Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="authors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Author Q&A Sessions</CardTitle>
              <CardDescription>
                Ask questions to verified authors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {authors.filter(a => a.verified).slice(0, 3).map(author => (
                  <Card key={author.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{author.name}</CardTitle>
                          <CardDescription>{author.bio}</CardDescription>
                        </div>
                        <Badge>Verified Author</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span>{author.followers.toLocaleString()} followers</span>
                        <span>{author.bookIds.length} books</span>
                      </div>
                      <Button variant="outline">View Q&A Session</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

