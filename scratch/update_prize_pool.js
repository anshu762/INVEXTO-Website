const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updatePrizePool() {
  const activeTournament = await prisma.tournament.findFirst({
    where: { status: 'active' }
  });

  if (!activeTournament) {
    console.log("No active tournament found.");
    return;
  }

  console.log("Current Prize Pool:", activeTournament.prizePool);

  const newPrizePool = {
    "1": 1000,
    "2": 750,
    "3": 500,
    "4": 250,
    "5": 250
  };

  const updated = await prisma.tournament.update({
    where: { id: activeTournament.id },
    data: { prizePool: newPrizePool }
  });

  console.log("Successfully updated prize pool:", updated.prizePool);
}

updatePrizePool().catch(console.error).finally(() => prisma.$disconnect());
