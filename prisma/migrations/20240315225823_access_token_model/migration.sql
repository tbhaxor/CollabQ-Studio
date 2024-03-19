-- CreateTable
CREATE TABLE "access_tokens" (
    "id" BIGSERIAL NOT NULL,
    "socialAccountId" BIGINT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "access_tokens_socialAccountId_key" ON "access_tokens"("socialAccountId");

-- AddForeignKey
ALTER TABLE "access_tokens" ADD CONSTRAINT "access_tokens_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "social_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
