const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
(async () => {
  // Close all active tournaments
  const result = await prisma.tournament.updateMany({
    where: { status: "active" },
    data: { status: "completed" },
  });
  console.log("Closed", result.count, "tournament(s)");
  await prisma.$disconnect();
})();
