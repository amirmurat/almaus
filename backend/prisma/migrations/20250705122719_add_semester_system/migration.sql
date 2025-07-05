/*
  Warnings:

  - Added the required column `start_date` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing records with a default start date
UPDATE "students" SET "start_date" = '2023-09-01 00:00:00' WHERE "start_date" IS NULL;

-- CreateTable
CREATE TABLE "semesters" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "semesters_pkey" PRIMARY KEY ("id")
);
