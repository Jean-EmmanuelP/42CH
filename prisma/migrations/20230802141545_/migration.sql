/*
  Warnings:

  - You are about to alter the column `timerPublic` on the `Defi` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Defi" ALTER COLUMN "timerPublic" SET DATA TYPE INTEGER;
