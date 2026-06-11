import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({ suppressNotices: ['ripHistorical'] });

async function test() {
  const result2 = await yahooFinance.chart("RELIANCE.NS", {
    period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    interval: "1d",
  });
  console.log("Chart quotes length:", result2.quotes?.length);
  console.log("Chart (first quote):", result2.quotes?.[0]);
}

test().catch(console.error);
