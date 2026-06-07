-- CreateTable
CREATE TABLE "DailyReflection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "wins" TEXT,
    "blockers" TEXT,
    "distractions" TEXT,
    "tomorrowCommitment" TEXT,
    "focusScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyReflection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyReflection_userId_idx" ON "DailyReflection"("userId");

-- CreateIndex
CREATE INDEX "DailyReflection_createdAt_idx" ON "DailyReflection"("createdAt");

-- AddForeignKey
ALTER TABLE "DailyReflection" ADD CONSTRAINT "DailyReflection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
