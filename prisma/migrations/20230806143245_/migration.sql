-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "isEventOfTheWeek" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "balance" SET DEFAULT 10000;
