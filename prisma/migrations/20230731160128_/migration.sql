-- CreateTable
CREATE TABLE "UsersBet" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "challengeId" TEXT,

    CONSTRAINT "UsersBet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UsersBet" ADD CONSTRAINT "UsersBet_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE SET NULL ON UPDATE CASCADE;
