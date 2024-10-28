-- CreateTable
CREATE TABLE "Workspace" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ownerid" INTEGER NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchList" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "WatchList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "ticker" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_WatchListToWorkspace" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_WatchListToCompany" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_name_key" ON "Workspace"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WatchList_name_key" ON "WatchList"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_WatchListToWorkspace_AB_unique" ON "_WatchListToWorkspace"("A", "B");

-- CreateIndex
CREATE INDEX "_WatchListToWorkspace_B_index" ON "_WatchListToWorkspace"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_WatchListToCompany_AB_unique" ON "_WatchListToCompany"("A", "B");

-- CreateIndex
CREATE INDEX "_WatchListToCompany_B_index" ON "_WatchListToCompany"("B");

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_ownerid_fkey" FOREIGN KEY ("ownerid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WatchListToWorkspace" ADD CONSTRAINT "_WatchListToWorkspace_A_fkey" FOREIGN KEY ("A") REFERENCES "WatchList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WatchListToWorkspace" ADD CONSTRAINT "_WatchListToWorkspace_B_fkey" FOREIGN KEY ("B") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WatchListToCompany" ADD CONSTRAINT "_WatchListToCompany_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WatchListToCompany" ADD CONSTRAINT "_WatchListToCompany_B_fkey" FOREIGN KEY ("B") REFERENCES "WatchList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
