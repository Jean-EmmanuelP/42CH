/*
  Warnings:

  - A unique constraint covering the columns `[creatorId]` on the table `Defi` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[opponentId]` on the table `Defi` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Defi_creatorId_key" ON "Defi"("creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "Defi_opponentId_key" ON "Defi"("opponentId");
