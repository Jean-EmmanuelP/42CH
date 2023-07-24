-- CreateTable
CREATE TABLE "Defi" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" TEXT NOT NULL,
    "opponenentId" TEXT NOT NULL,
    "creatorHonor" BOOLEAN NOT NULL,
    "opponentHonor" BOOLEAN NOT NULL,
    "creatorBid" INTEGER NOT NULL,
    "opponentBid" INTEGER NOT NULL,
    "contractTerms" TEXT NOT NULL,
    "gameSelected" TEXT NOT NULL,

    CONSTRAINT "Defi_pkey" PRIMARY KEY ("id")
);
