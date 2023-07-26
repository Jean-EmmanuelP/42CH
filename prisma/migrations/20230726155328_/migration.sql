-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "creatorWinner" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "opponentWinner" TEXT NOT NULL DEFAULT '';
