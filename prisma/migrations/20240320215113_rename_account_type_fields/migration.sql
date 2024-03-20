/*
  Warnings:

  - The values [manager,team] on the enum `account_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "account_type_new" AS ENUM ('owner', 'editor');
ALTER TABLE "accounts" ALTER COLUMN "type" TYPE "account_type_new" USING ("type"::text::"account_type_new");
ALTER TYPE "account_type" RENAME TO "account_type_old";
ALTER TYPE "account_type_new" RENAME TO "account_type";
DROP TYPE "account_type_old";
COMMIT;
