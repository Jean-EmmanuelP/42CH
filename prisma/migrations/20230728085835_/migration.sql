-- CreateTable
CREATE TABLE "DefiRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderUsername" TEXT NOT NULL,
    "receiverUsername" TEXT NOT NULL,

    CONSTRAINT "DefiRequest_pkey" PRIMARY KEY ("id")
);
