import { Book, User, Recommendation, RecommendationSignal, Genre, Mood } from './types'

export function generateRecommendations(user: User, books: Book[]): Recommendation[] {
  if (!user.preferences) {
    return []
  }

  const recommendations: Recommendation[] = []

  for (const book of books) {
    const signals: RecommendationSignal[] = []
    let score = 0

    // Tag/genre match
    const genreMatch = book.genres.some(g => user.preferences!.genres.includes(g))
    if (genreMatch) {
      const matchStrength = book.genres.filter(g => user.preferences!.genres.includes(g)).length / book.genres.length
      score += matchStrength * 40
      signals.push({
        type: 'tag-match',
        strength: Math.round(matchStrength * 100),
        description: `Matches your preferred genres: ${book.genres.filter(g => user.preferences!.genres.includes(g)).join(', ')}`,
      })
    }

    // Mood match
    const moodMatch = book.moods.some(m => user.preferences!.moods.includes(m))
    if (moodMatch) {
      const matchStrength = book.moods.filter(m => user.preferences!.moods.includes(m)).length / book.moods.length
      score += matchStrength * 30
      signals.push({
        type: 'mood-match',
        strength: Math.round(matchStrength * 100),
        description: `Matches your preferred moods: ${book.moods.filter(m => user.preferences!.moods.includes(m)).join(', ')}`,
      })
    }

    // Similar books (based on genres and average rating)
    if (book.averageRating >= 4.0) {
      score += 15
      signals.push({
        type: 'similar-books',
        strength: 75,
        description: `Highly rated by readers (${book.averageRating.toFixed(1)}/5.0)`,
      })
    }

    // Trusted reviewer alignment (simulated)
    if (book.reviewCount > 100) {
      score += 10
      signals.push({
        type: 'trusted-reviewer',
        strength: 70,
        description: `Well-reviewed by ${book.reviewCount} readers`,
      })
    }

    // Format match
    const formatMatch = book.formats.some(f => user.preferences!.formats.includes(f))
    if (formatMatch) {
      score += 5
    }

    if (score > 30) {
      recommendations.push({
        id: `rec-${book.id}-${user.id}`,
        userId: user.id,
        bookId: book.id,
        score: Math.min(100, Math.round(score)),
        signals: signals.slice(0, 3),
        createdAt: new Date().toISOString(),
      })
    }
  }

  return recommendations.sort((a, b) => b.score - a.score)
}

