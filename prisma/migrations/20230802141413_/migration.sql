/*
  Warnings:

  - You are about to alter the column `timerPublic` on the `Challenge` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Challenge" ALTER COLUMN "timerPublic" SET DATA TYPE INTEGER;
