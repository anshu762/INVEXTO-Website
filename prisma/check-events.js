const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
(async () => {
  const events = await p.simulationEvent.findMany();
  console.log(JSON.stringify(events, null, 2));
  await p.$disconnect();
})();
