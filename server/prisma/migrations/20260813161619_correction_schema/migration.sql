/*
  Warnings:

  - The values [MODERATEUR] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `url` to the `Ressource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('UTILISATEUR', 'ADMIN');
ALTER TABLE "public"."Utilisateur" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Utilisateur" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "Utilisateur" ALTER COLUMN "role" SET DEFAULT 'UTILISATEUR';
COMMIT;

-- AlterTable
ALTER TABLE "Ressource" ADD COLUMN     "url" TEXT NOT NULL;
