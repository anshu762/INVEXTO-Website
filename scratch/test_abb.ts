import { fetchHistoricalPrices } from "../src/lib/yahoo-finance";

async function test() {
  const result = await fetchHistoricalPrices("ABB.NS", "1d");
  console.log("1d quotes count:", result.prices.length);
  if (result.prices.length > 0) {
    console.log("First:", result.prices[0].timestamp);
    console.log("Last:", result.prices[result.prices.length - 1].timestamp);
  }
}

test();
