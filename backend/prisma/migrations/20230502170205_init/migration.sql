-- CreateTable
CREATE TABLE "TikTokPost" (
    "id" TEXT NOT NULL,
    "heartCount" BIGINT,
    "shareCount" BIGINT,
    "commentCount" BIGINT,
    "description" TEXT,
    "videoUrl" TEXT,
    "videoCover" TEXT,
    "videoWidth" INTEGER,
    "videoHeight" INTEGER,
    "videoHash" TEXT,
    "authorId" TEXT,
    "i_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "i_updatedAt" TIMESTAMP(3) NOT NULL,
    "i_fetchedAt" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "TikTokUser" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "nickname" TEXT,
    "avatarUrl" TEXT,
    "avatarHash" TEXT,
    "i_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "i_updatedAt" TIMESTAMP(3) NOT NULL,
    "i_fetchedAt" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "TikTokPost_id_key" ON "TikTokPost"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TikTokUser_id_key" ON "TikTokUser"("id");

-- AddForeignKey
ALTER TABLE "TikTokPost" ADD CONSTRAINT "TikTokPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "TikTokUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
