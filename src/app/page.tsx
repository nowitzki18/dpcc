"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Star, Users, TrendingUp, Shield, Target } from "lucide-react"

export default function HomePage() {
  const { currentUser } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard")
    }
  }, [currentUser, router])

  if (currentUser) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Discover Your Next Favorite Book</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Get personalized recommendations in under 60 seconds. Understand why we recommend each book with explainable AI.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/discover">
            <Button size="lg" variant="outline">Explore Books</Button>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 mb-16">
        <Card>
          <CardHeader>
            <Star className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Explainable Recommendations</CardTitle>
            <CardDescription>
              See the top 3 reasons why each book is recommended to you
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Trust & Safety</CardTitle>
            <CardDescription>
              Verified reviews, integrity scoring, and transparent moderation
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Users className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Community</CardTitle>
            <CardDescription>
              Join book clubs, discuss with authors, and share your reading journey
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="grid md:grid-cols-2 gap-8 mb-16">
        <Card>
          <CardHeader>
            <TrendingUp className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Reading Tracking</CardTitle>
            <CardDescription>
              Track your reading progress, estimate completion time, and build streaks
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Target className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Goals & Challenges</CardTitle>
            <CardDescription>
              Set reading goals, complete challenges, and celebrate your year in review
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to start reading?</h2>
        <p className="text-muted-foreground mb-6">
          Join thousands of readers discovering their next favorite book
        </p>
        <Link href="/signup">
          <Button size="lg">Sign Up Free</Button>
        </Link>
      </section>
    </div>
  )
}

