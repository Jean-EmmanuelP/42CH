-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "description" TEXT,
ADD COLUMN     "participantId" TEXT;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
