const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

const events = [
  { name: "COVID-19 Crash", description: "Global pandemic triggers sharp market sell-off. Feb–Apr 2020. Most stocks fell 20-50%. IT and FMCG showed relative resilience.", startRealDate: new Date("2020-02-20"), endRealDate: new Date("2020-04-30"), durationDays: 70 },
  { name: "COVID Recovery Rally", description: "Markets rebound sharply from pandemic lows driven by liquidity and vaccine optimism. May–Dec 2020.", startRealDate: new Date("2020-05-01"), endRealDate: new Date("2020-12-31"), durationDays: 245 },
  { name: "2008 Global Financial Crisis", description: "Subprime mortgage crisis triggers worldwide recession. Most Indian stocks fell 40-60%.", startRealDate: new Date("2008-09-15"), endRealDate: new Date("2008-11-30"), durationDays: 76 },
  { name: "2016 Demonetisation", description: "India's sudden currency ban causes short-term market disruption. Nov–Dec 2016.", startRealDate: new Date("2016-11-08"), endRealDate: new Date("2016-12-31"), durationDays: 53 },
  { name: "2020-2021 Bull Market", description: "Historic bull run driven by retail participation, low interest rates, and economic reopening. Jan–Oct 2021.", startRealDate: new Date("2021-01-01"), endRealDate: new Date("2021-10-31"), durationDays: 304 },
  { name: "2022 Global Inflation Selloff", description: "Rising interest rates and inflation fears cause broad market correction. IT stocks hit hardest. Jan–Jun 2022.", startRealDate: new Date("2022-01-01"), endRealDate: new Date("2022-06-30"), durationDays: 181 },
  { name: "2023 Nifty 50 ATH Rally", description: "Markets hit all-time highs driven by strong domestic flows and political stability. Nov–Dec 2023.", startRealDate: new Date("2023-11-01"), endRealDate: new Date("2023-12-31"), durationDays: 61 },
];

(async () => {
  await p.simulationEvent.deleteMany();
  for (const e of events) {
    await p.simulationEvent.create({ data: { ...e, priceMultipliers: {} } });
  }
  console.log("Created", events.length, "simulation events");
  await p.$disconnect();
})();
