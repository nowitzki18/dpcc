# GreatReads

A production-grade clickable prototype for personalized book discovery with explainable recommendations, reading tracking, trust & safety features, and community engagement.

## Features

- **Personalized Discovery**: Get book recommendations in under 60 seconds with explainable AI showing top 3 reasons
- **Reading Tracking**: Track reading progress, estimate completion time, and build reading streaks
- **Trust & Safety**: Review integrity scoring, verified reader badges, and transparent moderation
- **Community**: Join book clubs, participate in discussion threads, and connect with authors
- **Goals & Challenges**: Set reading goals, complete challenges, and generate shareable year-in-review cards
- **Analytics**: View reading analytics with charts and insights

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: TailwindCSS + shadcn/ui + lucide-react
- **State Management**: Zustand with localStorage persistence
- **Charts**: Recharts
- **Image Generation**: html2canvas for shareable cards

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd greatreads
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build settings
4. Deploy!

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Demo Mode

The app comes pre-seeded with demo data including:
- 10 books across multiple genres
- 5 authors
- 4 demo users (reader, reviewer, author, admin)
- Sample reviews, reading logs, book clubs, and threads

To reset demo data:
1. Sign in as admin (admin@greatreads.com)
2. Go to `/admin`
3. Click "Reset Demo Data"

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── signup/            # User signup
│   ├── onboarding/        # Preference setup
│   ├── discover/          # Personalized discovery
│   ├── book/[id]/         # Book detail page
│   ├── review/[id]/       # Write review
│   ├── reader/[id]/       # Reading tracker
│   ├── trust/             # Trust & safety dashboard
│   ├── community/        # Book clubs & discussions
│   ├── goals/             # Reading goals & challenges
│   ├── year-in-review/    # Shareable year summary
│   ├── admin/             # Admin dashboard
│   └── settings/          # User settings
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── BookCard.tsx      # Book card component
│   ├── RatingInput.tsx   # Quarter-star rating
│   ├── TrustPill.tsx     # Trust indicator
│   └── ...
├── lib/                   # Utilities & data
│   ├── types.ts          # TypeScript types
│   ├── seed.ts           # Seed data
│   ├── store.ts          # Zustand store
│   ├── utils.ts          # Utility functions
│   └── recommendations.ts # Recommendation engine
└── ...
```

## Key Routes

- `/` - Landing page
- `/signup` - Create account
- `/onboarding` - Set preferences
- `/discover` - Personalized recommendations
- `/book/[id]` - Book details
- `/review/[id]` - Write review
- `/reader/[id]` - Reading tracker
- `/trust` - Trust dashboard
- `/community` - Book clubs & threads
- `/goals` - Reading goals
- `/year-in-review` - Shareable summary
- `/admin` - Admin dashboard (admin only)
- `/settings` - User settings

## Features in Detail

### Explainable Recommendations

Every recommendation shows the top 3 reasons why a book is recommended:
- Tag/genre matches
- Similar books you've rated highly
- Trusted reviewer alignment
- Mood matches

### Trust & Safety

- **Review Integrity**: Automatic analysis of reviews for suspicious patterns
- **Trust Scores**: Calculated based on review quality, helpful votes, and verified markers
- **Shadow Banning**: Admin can hide reviews from public view
- **Reporting**: Users can report review bombing, spam, or inappropriate content

### Reading Tracking

- Track reading status (Want/Reading/Read/DNF)
- Progress slider with percentage
- Reading time estimation
- Pages per day tracking
- Reading streaks

### Community

- **Book Clubs**: Join clubs by genre, location, or interest
- **Discussion Threads**: Discuss books and topics
- **Author Q&A**: Connect with verified authors

### Year in Review

Generate shareable cards with:
- Books read
- Pages read
- Hours read
- Favorite genres
- Average rating
- Top books

## Data Persistence

All data is stored in localStorage using Zustand's persist middleware. No backend or database required for the prototype.

## Customization

### Colors

Edit `src/app/globals.css` to customize the accent color via CSS variables:

```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Change this for accent color */
}
```

### Seed Data

Modify `src/lib/seed.ts` to add more books, authors, or users.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

