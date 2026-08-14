/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Ressource` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ressource_url_key" ON "Ressource"("url");
