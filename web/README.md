# ProofReel - Verifiable Win Tracker for Whop

A Next.js web application that allows Whop sellers to create challenges for their members to submit videos and prove their success with analytics verification.

## Features

### For Members
- **Submit Videos**: Submit Instagram Reels, TikTok, or YouTube Shorts URLs
- **Track Progress**: View submission status and manage analytics uploads
- **Upload Proof**: Upload screen recordings of analytics when view goals are met
- **View Gallery**: Browse approved submissions from the community

### For Sellers
- **Create Challenges**: Set up challenges linked to Whop products
- **Review Submissions**: Side-by-side video player for reviewing original videos and analytics
- **Approve/Reject**: Approve or reject submissions with one click
- **Dashboard**: Overview of all challenges and submission statistics

### Public Gallery
- **Verified Wins**: Public gallery showcasing approved submissions
- **Filter by Challenge**: Browse submissions by specific challenges
- **Video Player**: Watch approved videos directly in the gallery

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Supabase Storage
- **Authentication**: Whop OAuth (to be implemented)
- **Video Player**: React Player

## Database Schema

### Sellers
- `id` (String, Primary Key)
- `whopUserId` (String, Unique)
- `createdAt` (DateTime)

### Challenges
- `id` (String, Primary Key)
- `sellerId` (String, Foreign Key)
- `whopProductId` (String)
- `title` (String)
- `description` (String, Optional)
- `minimumViewCount` (Int)
- `isActive` (Boolean)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Submissions
- `id` (String, Primary Key)
- `challengeId` (String, Foreign Key)
- `memberWhopUserId` (String)
- `memberWhopUsername` (String)
- `originalVideoUrl` (String)
- `videoMetadata` (JSON, Optional)
- `analyticsVideoUrl` (String, Optional)
- `status` (Enum: SUBMITTED, AWAITING_ANALYTICS, PENDING_REVIEW, APPROVED, REJECTED)
- `submittedAt` (DateTime)
- `approvedAt` (DateTime, Optional)

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Supabase account
- Whop developer account (for OAuth)

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/proofreel"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Whop OAuth
WHOP_CLIENT_ID="your-whop-client-id"
WHOP_CLIENT_SECRET="your-whop-client-secret"
```

### 3. Database Setup

1. Create a PostgreSQL database
2. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

### 4. Supabase Setup

1. Create a new Supabase project
2. Create a storage bucket named `proofreel-storage`
3. Set up RLS policies for the bucket
4. Add your Supabase credentials to the environment variables

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## API Endpoints

### Submissions
- `GET /api/submissions` - Get all submissions (with optional filters)
- `POST /api/submissions` - Create a new submission
- `GET /api/submissions/[id]` - Get a specific submission
- `PATCH /api/submissions/[id]` - Update a submission

### Challenges
- `GET /api/challenges` - Get all challenges (with optional filters)
- `POST /api/challenges` - Create a new challenge

### Video Metadata
- `POST /api/video-metadata` - Fetch video metadata using oEmbed

### File Upload
- `POST /api/upload` - Upload analytics videos to Supabase Storage

## Project Structure

```
web/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   ├── dashboard/           # Admin dashboard pages
│   │   ├── gallery/             # Public gallery
│   │   ├── my-submissions/      # Member submissions page
│   │   ├── submit/              # Video submission page
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   ├── components/
│   │   └── ui/                  # Shadcn/UI components
│   └── lib/
│       ├── prisma.ts            # Prisma client
│       ├── supabase.ts          # Supabase client
│       └── utils.ts             # Utility functions
├── prisma/
│   └── schema.prisma            # Database schema
└── package.json
```

## Key Features Implementation

### Side-by-Side Video Player
The core feature for reviewing submissions uses React Player to display:
- Left side: Original video (Instagram Reel, TikTok, YouTube Short)
- Right side: Analytics proof video uploaded by the member

### Video Metadata Extraction
Uses the noembed.com API to extract:
- Video title
- Thumbnail URL
- Author information
- Platform-specific metadata

### File Upload System
- Validates file type (video only)
- Enforces size limits (100MB max)
- Uploads to Supabase Storage
- Generates public URLs for access

### Status Management
Submissions flow through these states:
1. **SUBMITTED** - Initial submission
2. **AWAITING_ANALYTICS** - Member claims to have hit the goal
3. **PENDING_REVIEW** - Analytics uploaded, awaiting admin review
4. **APPROVED** - Admin approved the submission
5. **REJECTED** - Admin rejected the submission

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Future Enhancements

- [ ] Whop OAuth integration
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] Social sharing features
- [ ] Leaderboards
- [ ] Automated view count verification

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.