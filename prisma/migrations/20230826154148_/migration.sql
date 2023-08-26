/*
  Warnings:

  - You are about to drop the column `description` on the `Matches` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Matches` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Matches" DROP COLUMN "description",
DROP COLUMN "title";
