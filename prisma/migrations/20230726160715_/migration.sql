-- CreateTable
CREATE TABLE "ChallengeHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChallengeHistory_pkey" PRIMARY KEY ("id")
);
