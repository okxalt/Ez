/*
  Warnings:

  - The primary key for the `Submission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `analyticsVideoPath` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `currentViews` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `reviewed` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedAt` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedByEmail` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `shortVideoUrl` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `challengeId` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberWhopUserId` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberWhopUsername` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalVideoUrl` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoMetadata` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Seller" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "whopUserId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sellerId" TEXT NOT NULL,
    "whopProductId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "minimumViewCount" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Challenge_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "challengeId" TEXT NOT NULL,
    "memberWhopUserId" TEXT NOT NULL,
    "memberWhopUsername" TEXT NOT NULL,
    "originalVideoUrl" TEXT NOT NULL,
    "videoMetadata" JSONB NOT NULL,
    "analyticsVideoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" DATETIME,
    CONSTRAINT "Submission_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Submission" ("id") SELECT "id" FROM "Submission";
DROP TABLE "Submission";
ALTER TABLE "new_Submission" RENAME TO "Submission";
CREATE INDEX "Submission_challengeId_idx" ON "Submission"("challengeId");
CREATE INDEX "Submission_memberWhopUserId_idx" ON "Submission"("memberWhopUserId");
CREATE INDEX "Submission_status_idx" ON "Submission"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Seller_whopUserId_key" ON "Seller"("whopUserId");

-- CreateIndex
CREATE INDEX "Challenge_sellerId_idx" ON "Challenge"("sellerId");

-- CreateIndex
CREATE INDEX "Challenge_whopProductId_idx" ON "Challenge"("whopProductId");
