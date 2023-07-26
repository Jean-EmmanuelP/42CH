-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "creatorAnswer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "opponentAnswer" BOOLEAN NOT NULL DEFAULT false;
