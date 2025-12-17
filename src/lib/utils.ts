import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d);
}

export function calculateReadingTime(pages: number, pagesPerDay: number): number {
  if (pagesPerDay === 0) return 0;
  return Math.ceil(pages / pagesPerDay);
}

export function estimateReadingTimeMinutes(pages: number, readingSpeed: number = 250): number {
  // Average reading speed: 250 words per minute, ~250 words per page
  return Math.ceil((pages * 250) / readingSpeed);
}

export function calculateTrustScore(review: {
  content: string;
  helpfulCount: number;
  reportCount: number;
  verifiedPurchase: boolean;
  finishedReading: boolean;
}): number {
  let score = 50; // Base score
  
  // Length bonus (longer reviews are generally more trustworthy)
  if (review.content.length > 500) score += 15;
  else if (review.content.length > 200) score += 10;
  else if (review.content.length < 50) score -= 10;
  
  // Helpful votes
  score += Math.min(review.helpfulCount * 2, 20);
  
  // Verified markers
  if (review.verifiedPurchase) score += 10;
  if (review.finishedReading) score += 10;
  
  // Report penalty
  score -= review.reportCount * 5;
  
  return Math.max(0, Math.min(100, score));
}

export function analyzeReviewIntegrity(review: {
  content: string;
  rating: number;
  createdAt: string;
  userId: string;
}, allReviews: Array<{ userId: string; createdAt: string; content: string; rating: number }>): {
  risk: 'low' | 'medium' | 'high';
  reasons: string[];
} {
  const reasons: string[] = [];
  let riskScore = 0;
  
  // Check for repeated phrases (potential spam)
  const words = review.content.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  if (words.length > 0 && uniqueWords.size / words.length < 0.3) {
    riskScore += 30;
    reasons.push('Repetitive language detected');
  }
  
  // Check for extreme ratings
  if (review.rating === 1 || review.rating === 5) {
    riskScore += 10;
    if (review.content.length < 100) {
      riskScore += 20;
      reasons.push('Extreme rating with minimal explanation');
    }
  }
  
  // Check for review bombing (multiple reviews from same user in short time)
  const userReviews = allReviews.filter(r => r.userId === review.userId);
  const recentReviews = userReviews.filter(r => {
    const timeDiff = new Date(review.createdAt).getTime() - new Date(r.createdAt).getTime();
    return timeDiff > 0 && timeDiff < 3600000; // Within 1 hour
  });
  if (recentReviews.length > 3) {
    riskScore += 40;
    reasons.push('Multiple reviews in short timeframe (possible review bombing)');
  }
  
  // Check for very short reviews with high ratings
  if (review.content.length < 50 && review.rating >= 4.5) {
    riskScore += 15;
    reasons.push('Very short review with high rating');
  }
  
  let risk: 'low' | 'medium' | 'high' = 'low';
  if (riskScore >= 50) risk = 'high';
  else if (riskScore >= 25) risk = 'medium';
  
  if (risk === 'low' && reasons.length === 0) {
    reasons.push('No integrity concerns detected');
  }
  
  return { risk, reasons };
}

