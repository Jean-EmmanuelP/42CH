-- CreateTable
CREATE TABLE "Matches" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "firstTeam" TEXT NOT NULL DEFAULT '',
    "secondTeam" TEXT NOT NULL DEFAULT '',
    "winner" TEXT,
    "rowPosition" INTEGER NOT NULL,
    "column" INTEGER NOT NULL,
    "isFinal" BOOLEAN NOT NULL DEFAULT false,
    "tourneyId" TEXT,

    CONSTRAINT "Matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tourney" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "participantsUsernames" TEXT[],
    "isFull" BOOLEAN NOT NULL DEFAULT false,
    "winner" TEXT,
    "column" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Tourney_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_tourneyId_fkey" FOREIGN KEY ("tourneyId") REFERENCES "Tourney"("id") ON DELETE SET NULL ON UPDATE CASCADE;
