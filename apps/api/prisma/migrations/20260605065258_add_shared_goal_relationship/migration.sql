-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "relationshipId" TEXT;

-- CreateIndex
CREATE INDEX "Goal_relationshipId_idx" ON "Goal"("relationshipId");

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_relationshipId_fkey" FOREIGN KEY ("relationshipId") REFERENCES "Relationship"("id") ON DELETE SET NULL ON UPDATE CASCADE;
