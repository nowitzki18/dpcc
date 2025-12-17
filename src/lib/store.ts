import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  User, Book, Author, Review, ReadingLog, BookClub, Thread, 
  Recommendation, ReadingGoal, Report, UserPreferences 
} from './types';
import { getSeedData } from './seed';

interface AppState {
  // Auth
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // Data
  books: Book[];
  authors: Author[];
  users: User[];
  reviews: Review[];
  readingLogs: ReadingLog[];
  clubs: BookClub[];
  threads: Thread[];
  recommendations: Recommendation[];
  goals: ReadingGoal[];
  reports: Report[];
  
  // Actions
  addBook: (book: Book) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  addReview: (review: Review) => void;
  updateReview: (id: string, updates: Partial<Review>) => void;
  addReadingLog: (log: ReadingLog) => void;
  updateReadingLog: (id: string, updates: Partial<ReadingLog>) => void;
  addClub: (club: BookClub) => void;
  addThread: (thread: Thread) => void;
  updateThread: (id: string, updates: Partial<Thread>) => void;
  addRecommendation: (rec: Recommendation) => void;
  updateGoal: (id: string, updates: Partial<ReadingGoal>) => void;
  addReport: (report: Report) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  updateUserPreferences: (preferences: UserPreferences) => void;
  
  // Reset
  resetDemoData: () => void;
}

const seedData = getSeedData();

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      currentUser: seedData.users[0],
      books: seedData.books,
      authors: seedData.authors,
      users: seedData.users,
      reviews: seedData.reviews,
      readingLogs: seedData.readingLogs,
      clubs: seedData.clubs,
      threads: seedData.threads,
      recommendations: seedData.recommendations,
      goals: seedData.goals,
      reports: [],
      
      // Auth
      setCurrentUser: (user) => set({ currentUser: user }),
      
      // Books
      addBook: (book) => set((state) => ({ books: [...state.books, book] })),
      updateBook: (id, updates) =>
        set((state) => ({
          books: state.books.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        })),
      
      // Reviews
      addReview: (review) => set((state) => ({ reviews: [...state.reviews, review] })),
      updateReview: (id, updates) =>
        set((state) => ({
          reviews: state.reviews.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),
      
      // Reading Logs
      addReadingLog: (log) => set((state) => ({ readingLogs: [...state.readingLogs, log] })),
      updateReadingLog: (id, updates) =>
        set((state) => ({
          readingLogs: state.readingLogs.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        })),
      
      // Clubs
      addClub: (club) => set((state) => ({ clubs: [...state.clubs, club] })),
      
      // Threads
      addThread: (thread) => set((state) => ({ threads: [...state.threads, thread] })),
      updateThread: (id, updates) =>
        set((state) => ({
          threads: state.threads.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      
      // Recommendations
      addRecommendation: (rec) => set((state) => ({ recommendations: [...state.recommendations, rec] })),
      
      // Goals
      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        })),
      
      // Reports
      addReport: (report) => set((state) => ({ reports: [...state.reports, report] })),
      updateReport: (id, updates) =>
        set((state) => ({
          reports: state.reports.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),
      
      // User preferences
      updateUserPreferences: (preferences) =>
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, preferences }
            : null,
        })),
      
      // Reset
      resetDemoData: () => {
        const freshSeed = getSeedData();
        set({
          currentUser: freshSeed.users[0],
          books: freshSeed.books,
          authors: freshSeed.authors,
          users: freshSeed.users,
          reviews: freshSeed.reviews,
          readingLogs: freshSeed.readingLogs,
          clubs: freshSeed.clubs,
          threads: freshSeed.threads,
          recommendations: freshSeed.recommendations,
          goals: freshSeed.goals,
          reports: [],
        });
      },
    }),
    {
      name: 'greatreads-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        books: state.books,
        authors: state.authors,
        users: state.users,
        reviews: state.reviews,
        readingLogs: state.readingLogs,
        clubs: state.clubs,
        threads: state.threads,
        recommendations: state.recommendations,
        goals: state.goals,
        reports: state.reports,
      }),
    }
  )
);

