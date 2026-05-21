-- CreateEnum
CREATE TYPE "Device" AS ENUM ('LAPTOP', 'TABLET');

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "model" "Device" NOT NULL,
    "checkedOut" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_model_key" ON "Item"("model");
