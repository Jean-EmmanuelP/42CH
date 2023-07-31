-- AlterTable
ALTER TABLE "User" ADD COLUMN     "friends" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "friendsRequests" TEXT[] DEFAULT ARRAY[]::TEXT[];
