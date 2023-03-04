-- CreateTable
CREATE TABLE "Site" (
    "name" VARCHAR(255) NOT NULL,
    "location" VARCHAR(50) NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuration" (
    "id" INTEGER NOT NULL,
    "battery" JSONB NOT NULL,
    "production" JSONB NOT NULL,

    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricalData" (
    "id" SERIAL NOT NULL,
    "siteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "timeStamp" TEXT NOT NULL,
    "soc" INTEGER NOT NULL,
    "load_kwh" DOUBLE PRECISION NOT NULL,
    "net_load_kwh" DOUBLE PRECISION NOT NULL,
    "pv_notification" BOOLEAN NOT NULL,
    "bio_notification" BOOLEAN NOT NULL,
    "cro_notification" BOOLEAN NOT NULL,

    CONSTRAINT "HistoricalData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Site_name_key" ON "Site"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_id_key" ON "Configuration"("id");

-- AddForeignKey
ALTER TABLE "Configuration" ADD CONSTRAINT "Configuration_id_fkey" FOREIGN KEY ("id") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricalData" ADD CONSTRAINT "HistoricalData_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
