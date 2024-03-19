/*
  Warnings:

  - You are about to drop the column `accessToken` on the `access_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `access_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `socialAccountId` on the `access_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `social_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `social_accounts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[social_account_id]` on the table `access_tokens` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[provider_id,account_id]` on the table `social_accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `access_token` to the `access_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `social_account_id` to the `access_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id` to the `social_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider_id` to the `social_accounts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "access_tokens" DROP CONSTRAINT "access_tokens_socialAccountId_fkey";

-- DropForeignKey
ALTER TABLE "social_accounts" DROP CONSTRAINT "social_accounts_accountId_fkey";

-- DropIndex
DROP INDEX "access_tokens_socialAccountId_key";

-- DropIndex
DROP INDEX "social_accounts_providerId_accountId_key";

-- AlterTable
ALTER TABLE "access_tokens" DROP COLUMN "accessToken",
DROP COLUMN "refreshToken",
DROP COLUMN "socialAccountId",
ADD COLUMN     "access_token" TEXT NOT NULL,
ADD COLUMN     "refresh_token" TEXT,
ADD COLUMN     "social_account_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "social_accounts" DROP COLUMN "accountId",
DROP COLUMN "providerId",
ADD COLUMN     "account_id" BIGINT NOT NULL,
ADD COLUMN     "provider_id" VARCHAR(128) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "access_tokens_social_account_id_key" ON "access_tokens"("social_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "social_accounts_provider_id_account_id_key" ON "social_accounts"("provider_id", "account_id");

-- AddForeignKey
ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_tokens" ADD CONSTRAINT "access_tokens_social_account_id_fkey" FOREIGN KEY ("social_account_id") REFERENCES "social_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
