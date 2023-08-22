/*
  Warnings:

  - You are about to drop the `TikTokPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TikTokUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TikTokPost" DROP CONSTRAINT "TikTokPost_authorId_fkey";

-- DropTable
DROP TABLE "TikTokPost";

-- DropTable
DROP TABLE "TikTokUser";

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "i_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "i_updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "likes" INTEGER,
    "shares" INTEGER,
    "comments" INTEGER,
    "attachmentIds" TEXT[],
    "authorId" TEXT,
    "i_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "i_updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "handle" TEXT,
    "avatarUrl" TEXT,
    "i_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "i_updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_id_key" ON "Attachment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Post_id_key" ON "Post"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
