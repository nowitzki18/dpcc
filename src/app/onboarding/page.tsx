"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Genre, Mood, BookFormat, UserPreferences } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

const genres: Genre[] = ['fiction', 'non-fiction', 'mystery', 'sci-fi', 'fantasy', 'romance', 'thriller', 'historical', 'biography', 'self-help', 'poetry', 'horror']
const moods: Mood[] = ['uplifting', 'thought-provoking', 'fast-paced', 'slow-burn', 'emotional', 'lighthearted', 'dark', 'adventurous']
const formats: BookFormat[] = ['ebook', 'audiobook', 'pdf', 'physical']

export default function OnboardingPage() {
  const router = useRouter()
  const { currentUser, updateUserPreferences } = useStore()
  const { toast } = useToast()
  
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([])
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([])
  const [pace, setPace] = useState<'slow' | 'medium' | 'fast'>('medium')
  const [selectedFormats, setSelectedFormats] = useState<BookFormat[]>([])
  const [timeBudget, setTimeBudget] = useState([30])
  const [dislikedTropes, setDislikedTropes] = useState<string[]>([])

  const toggleGenre = (genre: Genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const toggleMood = (mood: Mood) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    )
  }

  const toggleFormat = (format: BookFormat) => {
    setSelectedFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
    )
  }

  const handleSubmit = () => {
    if (!currentUser) {
      router.push("/signup")
      return
    }

    const preferences: UserPreferences = {
      genres: selectedGenres,
      moods: selectedMoods,
      pace,
      formats: selectedFormats,
      timeBudget: timeBudget[0],
      dislikedTropes,
    }

    updateUserPreferences(preferences)
    toast({
      title: "Preferences saved!",
      description: "Let's discover some great books for you",
    })
    router.push("/discover")
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Please sign up first</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Tell Us About Your Reading Preferences</CardTitle>
          <CardDescription>
            Help us personalize your book recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <Label className="text-base font-semibold mb-3 block">Favorite Genres</Label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Badge
                  key={genre}
                  variant={selectedGenres.includes(genre) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleGenre(genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block">Preferred Moods</Label>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <Badge
                  key={mood}
                  variant={selectedMoods.includes(mood) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleMood(mood)}
                >
                  {mood}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block">Reading Pace</Label>
            <div className="flex gap-4">
              {(['slow', 'medium', 'fast'] as const).map((p) => (
                <Button
                  key={p}
                  type="button"
                  variant={pace === p ? "default" : "outline"}
                  onClick={() => setPace(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block">Preferred Formats</Label>
            <div className="flex flex-wrap gap-2">
              {formats.map((format) => (
                <Badge
                  key={format}
                  variant={selectedFormats.includes(format) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleFormat(format)}
                >
                  {format}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block">
              Daily Reading Time: {timeBudget[0]} minutes
            </Label>
            <Slider
              value={timeBudget}
              onValueChange={setTimeBudget}
              min={10}
              max={120}
              step={10}
            />
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block">Disliked Tropes (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {['love-triangles', 'unnecessary-sequels', 'info-dumps', 'mary-sue'].map((trope) => (
                <Badge
                  key={trope}
                  variant={dislikedTropes.includes(trope) ? "destructive" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setDislikedTropes(prev => 
                    prev.includes(trope) 
                      ? prev.filter(t => t !== trope)
                      : [...prev, trope]
                  )}
                >
                  {trope}
                </Badge>
              ))}
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full" size="lg">
            Continue to Discovery
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

