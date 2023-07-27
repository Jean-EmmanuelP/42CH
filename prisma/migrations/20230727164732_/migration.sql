/*
  Warnings:

  - You are about to drop the column `participantsId` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "participantsId",
ADD COLUMN     "participantsUsernames" TEXT[];
