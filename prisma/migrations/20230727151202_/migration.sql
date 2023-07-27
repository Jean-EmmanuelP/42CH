-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "limitedSeats" INTEGER,
    "participantsId" TEXT[],

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
