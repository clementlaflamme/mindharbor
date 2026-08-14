import { seedRessources } from "./seeds/seedRessources.js";
import { seedActivites } from "./seeds/seedActivites.js";
import { seedUsersMessages } from "./seeds/seedUsersAndMessages.js";
import prisma from "../src/utils/prisma.js";

async function main() {
  await seedRessources();
  await seedActivites();
  await seedUsersMessages();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });