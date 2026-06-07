-- CreateTable
CREATE TABLE "AiPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dream" TEXT NOT NULL,
    "currentSituation" TEXT,
    "mainObstacle" TEXT,
    "suggestedGoals" JSONB NOT NULL,
    "suggestedHabits" JSONB NOT NULL,
    "distractionStrategy" JSONB NOT NULL,
    "weeklyPlan" JSONB NOT NULL,
    "mentorStory" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiPlan_userId_idx" ON "AiPlan"("userId");

-- AddForeignKey
ALTER TABLE "AiPlan" ADD CONSTRAINT "AiPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
