/*
  Warnings:

  - A unique constraint covering the columns `[keycloakUser]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `keycloakUser` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "keycloakUser" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_keycloakUser_key" ON "User"("keycloakUser");
