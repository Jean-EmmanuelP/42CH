/*
  Warnings:

  - You are about to drop the column `inviteeId` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `inviterId` on the `Challenge` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participantId` to the `Challenge` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Challenge" DROP CONSTRAINT "Challenge_inviteeId_fkey";

-- DropForeignKey
ALTER TABLE "Challenge" DROP CONSTRAINT "Challenge_inviterId_fkey";

-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "inviteeId",
DROP COLUMN "inviterId",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "participantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
