-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "couponCode" TEXT,
ADD COLUMN     "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "percentOff" INTEGER,
    "amountOff" DECIMAL(10,2),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "maxUses" INTEGER,
    "minOrder" DECIMAL(10,2),
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- Seed the owner's first coupon: 15% off, no expiry, no usage limit.
-- Manage or disable it from the admin "קופונים" page.
INSERT INTO "Coupon" ("id", "code", "percentOff")
VALUES ('coupon_rfruitsfriends', 'rfruitsfriends', 15)
ON CONFLICT ("code") DO NOTHING;
