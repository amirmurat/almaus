/*
  Warnings:

  - Added the required column `group_name` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "group_name" TEXT NOT NULL,
ADD COLUMN     "teacher_id" TEXT;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
