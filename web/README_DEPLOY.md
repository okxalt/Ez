Deploying to Vercel

1. Create Vercel project pointing to `web/`.
2. Add env vars:
   - DATABASE_URL (Postgres, e.g. Vercel Postgres/Neon)
   - SESSION_PASSWORD (32+ chars)
   - ADMIN_SECRET (string you will use to log in admins)
   - NEXT_PUBLIC_MIN_VIEWS (e.g. 1000)
   - MIN_VIEWS (server-side default)
   - BLOB_READ_WRITE_TOKEN (if not installing Vercel Blob integration)
3. Install Vercel Postgres or Neon and paste its connection string.
4. Under Build & Development Settings:
   - Install Command: npm i
   - Build Command: npm run vercel-build
   - Output Directory: .next
5. First deploy will run `prisma migrate deploy` and build.
6. Open the app. Visit /submit, /submissions, /admin.
