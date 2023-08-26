/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Tourney` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Tourney" ALTER COLUMN "description" SET DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Tourney_title_key" ON "Tourney"("title");
