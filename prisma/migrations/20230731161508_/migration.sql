/*
  Warnings:

  - You are about to drop the column `winner` on the `UsersBet` table. All the data in the column will be lost.
  - Added the required column `winnerId` to the `UsersBet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UsersBet" DROP COLUMN "winner",
ADD COLUMN     "winnerId" TEXT NOT NULL;
