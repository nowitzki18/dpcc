export type UserRole = 'reader' | 'reviewer' | 'author' | 'admin';

export type ReadingStatus = 'want' | 'reading' | 'read' | 'dnf';

export type BookFormat = 'ebook' | 'audiobook' | 'pdf' | 'physical';

export type Genre = 
  | 'fiction' 
  | 'non-fiction' 
  | 'mystery' 
  | 'sci-fi' 
  | 'fantasy' 
  | 'romance' 
  | 'thriller' 
  | 'historical' 
  | 'biography' 
  | 'self-help' 
  | 'poetry' 
  | 'horror';

export type Mood = 
  | 'uplifting' 
  | 'thought-provoking' 
  | 'fast-paced' 
  | 'slow-burn' 
  | 'emotional' 
  | 'lighthearted' 
  | 'dark' 
  | 'adventurous';

export type TrustLevel = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  trustScore: number;
  verifiedReader: boolean;
  createdAt: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  genres: Genre[];
  moods: Mood[];
  pace: 'slow' | 'medium' | 'fast';
  formats: BookFormat[];
  timeBudget: number; // minutes per day
  dislikedTropes: string[];
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  verified: boolean;
  bookIds: string[];
  followers: number;
}

export interface Book {
  id: string;
  title: string;
  authorId: string;
  synopsis: string;
  coverImage?: string;
  pages: number;
  publishedYear: number;
  genres: Genre[];
  moods: Mood[];
  tags: string[];
  averageRating: number;
  reviewCount: number;
  isbn?: string;
  formats: BookFormat[];
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  rating: number; // 0-5 in 0.25 increments
  title?: string;
  content: string;
  spoiler: boolean;
  verifiedPurchase: boolean;
  finishedReading: boolean;
  helpfulCount: number;
  reportCount: number;
  integrityRisk: TrustLevel;
  integrityReasons: string[];
  pinned: boolean;
  shadowBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingLog {
  id: string;
  userId: string;
  bookId: string;
  status: ReadingStatus;
  progress: number; // 0-100
  pagesRead: number;
  pagesPerDay: number;
  startDate?: string;
  finishDate?: string;
  readingTimeMinutes: number;
  estimatedCompletionDate?: string;
  highlights: Highlight[];
  annotations: Annotation[];
}

export interface Highlight {
  id: string;
  text: string;
  page: number;
  createdAt: string;
}

export interface Annotation {
  id: string;
  text: string;
  page: number;
  createdAt: string;
}

export interface BookClub {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  genre: Genre;
  memberCount: number;
  location?: string;
  distance?: number; // km
  events: ClubEvent[];
  threadIds: string[];
  createdAt: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  bookId?: string;
}

export interface Thread {
  id: string;
  clubId?: string;
  bookId?: string;
  authorId: string;
  title: string;
  content: string;
  replyCount: number;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  type: 'review' | 'comment' | 'review-bombing' | 'user';
  targetId: string;
  reporterId: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface Recommendation {
  id: string;
  userId: string;
  bookId: string;
  score: number; // 0-100
  signals: RecommendationSignal[];
  createdAt: string;
}

export interface RecommendationSignal {
  type: 'tag-match' | 'similar-books' | 'trusted-reviewer' | 'genre-blend' | 'mood-match';
  strength: number;
  description: string;
}

export interface ReadingGoal {
  id: string;
  userId: string;
  year: number;
  targetBooks: number;
  currentBooks: number;
  targetPages: number;
  currentPages: number;
  streak: number;
  challenges: Challenge[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: 'books' | 'pages' | 'minutes';
  completed: boolean;
  deadline?: string;
}

export interface YearInReview {
  userId: string;
  year: number;
  booksRead: number;
  pagesRead: number;
  hoursRead: number;
  favoriteGenres: { genre: Genre; count: number }[];
  averageRating: number;
  longestStreak: number;
  topBooks: { bookId: string; rating: number }[];
}

