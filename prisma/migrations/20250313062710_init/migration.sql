-- CreateTable
CREATE TABLE "VehicleRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "unitName" TEXT NOT NULL,
    "personnelName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "notes" TEXT,
    "missionDate" DATETIME NOT NULL,
    "missionTime" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "withWheelchair" BOOLEAN NOT NULL DEFAULT false,
    "withStretcher" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
