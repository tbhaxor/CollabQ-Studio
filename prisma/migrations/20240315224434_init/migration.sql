-- CreateEnum
CREATE TYPE "social_account_provider" AS ENUM ('google');

-- CreateTable
CREATE TABLE "accounts" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_accounts" (
    "id" BIGSERIAL NOT NULL,
    "provider" "social_account_provider" NOT NULL DEFAULT 'google',
    "providerId" TEXT NOT NULL,
    "accountId" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "social_accounts_providerId_accountId_key" ON "social_accounts"("providerId", "accountId");

-- AddForeignKey
ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
