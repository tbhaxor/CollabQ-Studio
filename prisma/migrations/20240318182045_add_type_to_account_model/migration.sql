-- CreateEnum
CREATE TYPE "account_type" AS ENUM ('manager', 'team');

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "type" "account_type" NOT NULL DEFAULT 'manager';
