-- CreateTable
CREATE TABLE "Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'applied',
    "link" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
