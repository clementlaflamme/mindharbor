import { seedRessources } from "./seeds/seedRessources.js";
import { seedActivites } from "./seeds/seedActivites.js";
import { seedUsersMessages } from "./seeds/seedUsersAndMessages.js";
import { seedEntreeJournal } from "./seeds/seedEntreeJournal.js";
import { seedActivitesJournal } from "./seeds/seedActivitesJournal.js";
import { seedSignalements } from "./seeds/seedSignalements.js";
import { seedFavoris } from "./seeds/seedFavoris.js";
import prisma from "../src/utils/prisma.js";

async function main() {
  await seedRessources();
  await seedActivites();
  await seedUsersMessages();
  await seedEntreeJournal();
  await seedActivitesJournal();
  await seedSignalements();
  await seedFavoris();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
