/*
  Warnings:

  - You are about to drop the column `opponenentId` on the `Defi` table. All the data in the column will be lost.
  - Added the required column `opponentId` to the `Defi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Defi" DROP COLUMN "opponenentId",
ADD COLUMN     "opponentId" TEXT NOT NULL;
