/*
  Warnings:

  - You are about to drop the column `amount` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `participantId` on the `Challenge` table. All the data in the column will be lost.
  - Added the required column `inviteeId` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inviterId` to the `Challenge` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Challenge" DROP CONSTRAINT "Challenge_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Challenge" DROP CONSTRAINT "Challenge_participantId_fkey";

-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "amount",
DROP COLUMN "completedAt",
DROP COLUMN "creatorId",
DROP COLUMN "description",
DROP COLUMN "participantId",
ADD COLUMN     "inviteeId" TEXT NOT NULL,
ADD COLUMN     "inviterId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
