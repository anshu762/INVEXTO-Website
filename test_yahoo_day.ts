import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

async function test() {
  const lastFriday = new Date();
  // Assume today is a weekday, let's just go back 5 days to be safe and find a Friday.
  lastFriday.setDate(lastFriday.getDate() - 5);
  lastFriday.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(lastFriday);
  endOfDay.setHours(23, 59, 59, 999);

  const result = await yahooFinance.chart("RELIANCE.NS", {
    period1: lastFriday,
    period2: endOfDay,
    interval: "5m",
  });
  console.log("Chart quotes length:", result.quotes?.length);
  console.log("First quote:", result.quotes?.[0]);
  console.log("Last quote:", result.quotes?.[result.quotes?.length - 1]);
}

test().catch(console.error);
