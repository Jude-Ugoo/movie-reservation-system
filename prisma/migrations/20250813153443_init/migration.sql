/*
  Warnings:

  - The values [USER] on the enum `UserRoles` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `EmailNotification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `EmailNotification` table. All the data in the column will be lost.
  - The primary key for the `Movie` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Movie` table. All the data in the column will be lost.
  - The primary key for the `Payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Payment` table. All the data in the column will be lost.
  - The primary key for the `Promotion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Promotion` table. All the data in the column will be lost.
  - The primary key for the `Reservation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Reservation` table. All the data in the column will be lost.
  - The primary key for the `ReservationSeat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ReservationSeat` table. All the data in the column will be lost.
  - The primary key for the `Seat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Seat` table. All the data in the column will be lost.
  - The primary key for the `Showtime` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Showtime` table. All the data in the column will be lost.
  - The primary key for the `Theater` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Theater` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[seat_id,reservation_id]` on the table `ReservationSeat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seat_id,showtime_id,status]` on the table `ReservationSeat` will be added. If there are existing duplicate values, this will fail.
  - The required column `notification_id` was added to the `EmailNotification` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `movie_id` was added to the `Movie` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `payment_id` was added to the `Payment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `promotion_id` was added to the `Promotion` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `reservation_id` was added to the `Reservation` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `reservationSeat_id` was added to the `ReservationSeat` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `showtime_id` to the `ReservationSeat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ReservationSeat` table without a default value. This is not possible if the table is not empty.
  - The required column `seat_id` was added to the `Seat` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `showtime_id` was added to the `Showtime` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `theater_id` was added to the `Theater` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `user_id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."UserRoles_new" AS ENUM ('ADMIN', 'CUSTOMER');
ALTER TABLE "public"."User" ALTER COLUMN "role" TYPE "public"."UserRoles_new" USING ("role"::text::"public"."UserRoles_new");
ALTER TYPE "public"."UserRoles" RENAME TO "UserRoles_old";
ALTER TYPE "public"."UserRoles_new" RENAME TO "UserRoles";
DROP TYPE "public"."UserRoles_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."EmailNotification" DROP CONSTRAINT "EmailNotification_reservation_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."EmailNotification" DROP CONSTRAINT "EmailNotification_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_reservation_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reservation" DROP CONSTRAINT "Reservation_promotion_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reservation" DROP CONSTRAINT "Reservation_showtime_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reservation" DROP CONSTRAINT "Reservation_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ReservationSeat" DROP CONSTRAINT "ReservationSeat_reservation_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ReservationSeat" DROP CONSTRAINT "ReservationSeat_seat_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Seat" DROP CONSTRAINT "Seat_theater_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Showtime" DROP CONSTRAINT "Showtime_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Showtime" DROP CONSTRAINT "Showtime_promotion_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Showtime" DROP CONSTRAINT "Showtime_theater_id_fkey";

-- AlterTable
ALTER TABLE "public"."EmailNotification" DROP CONSTRAINT "EmailNotification_pkey",
DROP COLUMN "id",
ADD COLUMN     "notification_id" TEXT NOT NULL,
ADD CONSTRAINT "EmailNotification_pkey" PRIMARY KEY ("notification_id");

-- AlterTable
ALTER TABLE "public"."Movie" DROP CONSTRAINT "Movie_pkey",
DROP COLUMN "id",
ADD COLUMN     "movie_id" TEXT NOT NULL,
ADD CONSTRAINT "Movie_pkey" PRIMARY KEY ("movie_id");

-- AlterTable
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_pkey",
DROP COLUMN "id",
ADD COLUMN     "payment_id" TEXT NOT NULL,
ADD CONSTRAINT "Payment_pkey" PRIMARY KEY ("payment_id");

-- AlterTable
ALTER TABLE "public"."Promotion" DROP CONSTRAINT "Promotion_pkey",
DROP COLUMN "id",
ADD COLUMN     "promotion_id" TEXT NOT NULL,
ADD CONSTRAINT "Promotion_pkey" PRIMARY KEY ("promotion_id");

-- AlterTable
ALTER TABLE "public"."Reservation" DROP CONSTRAINT "Reservation_pkey",
DROP COLUMN "id",
ADD COLUMN     "reservation_id" TEXT NOT NULL,
ADD CONSTRAINT "Reservation_pkey" PRIMARY KEY ("reservation_id");

-- AlterTable
ALTER TABLE "public"."ReservationSeat" DROP CONSTRAINT "ReservationSeat_pkey",
DROP COLUMN "id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "reservationSeat_id" TEXT NOT NULL,
ADD COLUMN     "showtime_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "ReservationSeat_pkey" PRIMARY KEY ("reservationSeat_id");

-- AlterTable
ALTER TABLE "public"."Seat" DROP CONSTRAINT "Seat_pkey",
DROP COLUMN "id",
ADD COLUMN     "seat_id" TEXT NOT NULL,
ADD CONSTRAINT "Seat_pkey" PRIMARY KEY ("seat_id");

-- AlterTable
ALTER TABLE "public"."Showtime" DROP CONSTRAINT "Showtime_pkey",
DROP COLUMN "id",
ADD COLUMN     "showtime_id" TEXT NOT NULL,
ADD CONSTRAINT "Showtime_pkey" PRIMARY KEY ("showtime_id");

-- AlterTable
ALTER TABLE "public"."Theater" DROP CONSTRAINT "Theater_pkey",
DROP COLUMN "id",
ADD COLUMN     "theater_id" TEXT NOT NULL,
ADD CONSTRAINT "Theater_pkey" PRIMARY KEY ("theater_id");

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "is_active" DROP NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");

-- CreateIndex
CREATE INDEX "ReservationSeat_seat_id_status_idx" ON "public"."ReservationSeat"("seat_id", "status");

-- CreateIndex
CREATE INDEX "ReservationSeat_showtime_id_status_idx" ON "public"."ReservationSeat"("showtime_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ReservationSeat_seat_id_reservation_id_key" ON "public"."ReservationSeat"("seat_id", "reservation_id");

-- CreateIndex
CREATE UNIQUE INDEX "ReservationSeat_seat_id_showtime_id_status_key" ON "public"."ReservationSeat"("seat_id", "showtime_id", "status");

-- AddForeignKey
ALTER TABLE "public"."Seat" ADD CONSTRAINT "Seat_theater_id_fkey" FOREIGN KEY ("theater_id") REFERENCES "public"."Theater"("theater_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Showtime" ADD CONSTRAINT "Showtime_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "public"."Movie"("movie_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Showtime" ADD CONSTRAINT "Showtime_theater_id_fkey" FOREIGN KEY ("theater_id") REFERENCES "public"."Theater"("theater_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Showtime" ADD CONSTRAINT "Showtime_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "public"."Promotion"("promotion_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reservation" ADD CONSTRAINT "Reservation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reservation" ADD CONSTRAINT "Reservation_showtime_id_fkey" FOREIGN KEY ("showtime_id") REFERENCES "public"."Showtime"("showtime_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reservation" ADD CONSTRAINT "Reservation_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "public"."Promotion"("promotion_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReservationSeat" ADD CONSTRAINT "ReservationSeat_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "public"."Reservation"("reservation_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReservationSeat" ADD CONSTRAINT "ReservationSeat_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "public"."Seat"("seat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReservationSeat" ADD CONSTRAINT "ReservationSeat_showtime_id_fkey" FOREIGN KEY ("showtime_id") REFERENCES "public"."Showtime"("showtime_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "public"."Reservation"("reservation_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EmailNotification" ADD CONSTRAINT "EmailNotification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EmailNotification" ADD CONSTRAINT "EmailNotification_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "public"."Reservation"("reservation_id") ON DELETE RESTRICT ON UPDATE CASCADE;
