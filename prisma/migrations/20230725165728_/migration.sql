-- AlterTable
ALTER TABLE "Defi" ADD COLUMN     "creatorAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "opponentAccepted" BOOLEAN NOT NULL DEFAULT false;
