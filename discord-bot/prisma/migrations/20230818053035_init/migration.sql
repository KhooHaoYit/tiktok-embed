-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "config" JSONB,
    "i_updatedAt" TIMESTAMP(3) NOT NULL,
    "i_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);
