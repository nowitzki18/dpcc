"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Flame, BookOpen, TrendingUp } from "lucide-react"

export default function GoalsPage() {
  const { currentUser, goals, readingLogs } = useStore()

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Please sign in to view your goals</p>
      </div>
    )
  }

  const currentGoal = goals.find(g => g.userId === currentUser.id && g.year === new Date().getFullYear())
  const userLogs = readingLogs.filter(l => l.userId === currentUser.id)

  if (!currentGoal) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>No goals set for this year</p>
      </div>
    )
  }

  const booksProgress = (currentGoal.currentBooks / currentGoal.targetBooks) * 100
  const pagesProgress = (currentGoal.currentPages / currentGoal.targetPages) * 100

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reading Goals</h1>
        <p className="text-muted-foreground">
          Track your progress and complete challenges
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle>Books Goal</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">
              {currentGoal.currentBooks} / {currentGoal.targetBooks}
            </div>
            <Progress value={booksProgress} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {Math.round(booksProgress)}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>Pages Goal</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">
              {currentGoal.currentPages.toLocaleString()} / {currentGoal.targetPages.toLocaleString()}
            </div>
            <Progress value={pagesProgress} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {Math.round(pagesProgress)}% complete
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <CardTitle>Current Streak</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-2">{currentGoal.streak} days</div>
          <p className="text-sm text-muted-foreground">
            Keep reading to maintain your streak!
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Challenges</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {currentGoal.challenges.map(challenge => (
            <Card key={challenge.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <CardDescription>{challenge.description}</CardDescription>
                  </div>
                  {challenge.completed && (
                    <Badge className="bg-green-500">Completed</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{challenge.current} / {challenge.target} {challenge.unit}</span>
                  </div>
                  <Progress value={(challenge.current / challenge.target) * 100} />
                </div>
                {challenge.deadline && (
                  <p className="text-xs text-muted-foreground">
                    Deadline: {new Date(challenge.deadline).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

