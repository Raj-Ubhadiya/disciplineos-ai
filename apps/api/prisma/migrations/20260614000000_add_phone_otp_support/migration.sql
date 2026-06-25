ALTER TABLE "User"
ADD COLUMN "phone" TEXT,
ADD COLUMN "phoneVerifiedAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

ALTER TABLE "AuthOtp"
ADD COLUMN "channel" TEXT NOT NULL DEFAULT 'email',
ADD COLUMN "target" TEXT NOT NULL DEFAULT '',
ADD COLUMN "phone" TEXT;

ALTER TABLE "AuthOtp"
ALTER COLUMN "email" DROP NOT NULL;

UPDATE "AuthOtp"
SET "channel" = 'email',
    "target" = "email"
WHERE "target" = '';

DROP INDEX IF EXISTS "AuthOtp_email_purpose_createdAt_idx";

CREATE INDEX "AuthOtp_channel_target_purpose_createdAt_idx"
ON "AuthOtp"("channel", "target", "purpose", "createdAt");
