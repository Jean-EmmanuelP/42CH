/*
  Warnings:

  - Added the required column `winner` to the `UsersBet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UsersBet" ADD COLUMN     "winner" TEXT NOT NULL;
