-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS "Submission_challengeId_idx" ON "Submission" ("challengeId");
CREATE INDEX IF NOT EXISTS "Submission_memberWhopUserId_idx" ON "Submission" ("memberWhopUserId");
CREATE INDEX IF NOT EXISTS "Submission_status_idx" ON "Submission" ("status");
