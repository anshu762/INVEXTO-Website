interface NSEStockDef {
  symbol: string;
  name: string;
  sector: string;
}

export const nseStocks: NSEStockDef[] = [
  { symbol: "RELIANCE.NS", name: "Reliance Industries", sector: "Energy" },
  { symbol: "TCS.NS", name: "Tata Consultancy Services", sector: "IT" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank", sector: "Banking" },
  { symbol: "INFY.NS", name: "Infosys", sector: "IT" },
  { symbol: "ICICIBANK.NS", name: "ICICI Bank", sector: "Banking" },
  { symbol: "HINDUNILVR.NS", name: "Hindustan Unilever", sector: "FMCG" },
  { symbol: "ITC.NS", name: "ITC Limited", sector: "FMCG" },
  { symbol: "SBIN.NS", name: "State Bank of India", sector: "Banking" },
  { symbol: "BHARTIARTL.NS", name: "Bharti Airtel", sector: "Telecom" },
  { symbol: "BAJFINANCE.NS", name: "Bajaj Finance", sector: "Consumer" },
  { symbol: "KOTAKBANK.NS", name: "Kotak Mahindra Bank", sector: "Banking" },
  { symbol: "LT.NS", name: "Larsen & Toubro", sector: "Infrastructure" },
  { symbol: "WIPRO.NS", name: "Wipro", sector: "IT" },
  { symbol: "AXISBANK.NS", name: "Axis Bank", sector: "Banking" },
  { symbol: "TITAN.NS", name: "Titan Company", sector: "Consumer" },
  { symbol: "HCLTECH.NS", name: "HCL Technologies", sector: "IT" },
  { symbol: "ASIANPAINT.NS", name: "Asian Paints", sector: "Consumer" },
  { symbol: "MARUTI.NS", name: "Maruti Suzuki India", sector: "Auto" },
  { symbol: "SUNPHARMA.NS", name: "Sun Pharmaceutical", sector: "Pharma" },
  { symbol: "ULTRACEMCO.NS", name: "UltraTech Cement", sector: "Infrastructure" },
  { symbol: "NTPC.NS", name: "NTPC Limited", sector: "Energy" },
  { symbol: "TMPV.NS", name: "Tata Motors Passenger Vhcls Ltd", sector: "Auto" },
  { symbol: "M&M.NS", name: "Mahindra & Mahindra", sector: "Auto" },
  { symbol: "POWERGRID.NS", name: "Power Grid Corporation", sector: "Energy" },
  { symbol: "TATASTEEL.NS", name: "Tata Steel", sector: "Metals" },
  { symbol: "NESTLEIND.NS", name: "Nestle India", sector: "FMCG" },
  { symbol: "DRREDDY.NS", name: "Dr. Reddy's Laboratories", sector: "Pharma" },
  { symbol: "JSWSTEEL.NS", name: "JSW Steel", sector: "Metals" },
  { symbol: "ONGC.NS", name: "Oil and Natural Gas Corporation", sector: "Energy" },
  { symbol: "BAJAJ-AUTO.NS", name: "Bajaj Auto", sector: "Auto" },
  { symbol: "ADANIPORTS.NS", name: "Adani Ports and SEZ", sector: "Infrastructure" },
  { symbol: "TECHM.NS", name: "Tech Mahindra", sector: "IT" },
  { symbol: "HINDALCO.NS", name: "Hindalco Industries", sector: "Metals" },
  { symbol: "BRITANNIA.NS", name: "Britannia Industries", sector: "FMCG" },
  { symbol: "CIPLA.NS", name: "Cipla", sector: "Pharma" },
  { symbol: "DIVISLAB.NS", name: "Divi's Laboratories", sector: "Pharma" },
  { symbol: "DABUR.NS", name: "Dabur India", sector: "FMCG" },
  { symbol: "HEROMOTOCO.NS", name: "Hero MotoCorp", sector: "Auto" },
  { symbol: "HDFCLIFE.NS", name: "HDFC Life Insurance", sector: "Consumer" },
  { symbol: "BPCL.NS", name: "Bharat Petroleum", sector: "Energy" },
  { symbol: "BIOCON.NS", name: "Biocon", sector: "Pharma" },
  { symbol: "IDEA.NS", name: "Vodafone Idea", sector: "Telecom" },
  { symbol: "PERSISTENT.NS", name: "Persistent Systems", sector: "IT" },
  { symbol: "MPHASIS.NS", name: "Mphasis", sector: "IT" },
  { symbol: "COFORGE.NS", name: "Coforge", sector: "IT" },
  { symbol: "BANKBARODA.NS", name: "Bank of Baroda", sector: "Banking" },
  { symbol: "PNB.NS", name: "Punjab National Bank", sector: "Banking" },
  { symbol: "FEDERALBNK.NS", name: "Federal Bank", sector: "Banking" },
  { symbol: "IDFCFIRSTB.NS", name: "IDFC First Bank", sector: "Banking" },
  { symbol: "CANBK.NS", name: "Canara Bank", sector: "Banking" },
  { symbol: "MARICO.NS", name: "Marico", sector: "FMCG" },
  { symbol: "GODREJCP.NS", name: "Godrej Consumer Products", sector: "FMCG" },
  { symbol: "COLPAL.NS", name: "Colgate-Palmolive India", sector: "FMCG" },
  { symbol: "TATACONSUM.NS", name: "Tata Consumer Products", sector: "FMCG" },
  { symbol: "TVSMOTOR.NS", name: "TVS Motor Company", sector: "Auto" },
  { symbol: "MOTHERSON.NS", name: "Samvardhana Motherson", sector: "Auto" },
  { symbol: "BOSCHLTD.NS", name: "Bosch", sector: "Auto" },
  { symbol: "MANKIND.NS", name: "Mankind Pharma", sector: "Pharma" },
  { symbol: "TORNTPHARM.NS", name: "Torrent Pharmaceuticals", sector: "Pharma" },
  { symbol: "AUROPHARMA.NS", name: "Aurobindo Pharma", sector: "Pharma" },
  { symbol: "SIEMENS.NS", name: "Siemens India", sector: "Infrastructure" },
  { symbol: "ABB.NS", name: "ABB India", sector: "Infrastructure" },
  { symbol: "HAVELLS.NS", name: "Havells India", sector: "Consumer" },
  { symbol: "VEDL.NS", name: "Vedanta", sector: "Metals" },
  { symbol: "NMDC.NS", name: "NMDC", sector: "Metals" },
  { symbol: "SAIL.NS", name: "Steel Authority of India", sector: "Metals" },
  { symbol: "NYKAA.NS", name: "FSN E-Commerce (Nykaa)", sector: "Consumer" },
  { symbol: "ETERNAL.NS", name: "Eternal Ltd", sector: "Consumer" },
  { symbol: "PAYTM.NS", name: "One97 Communications (Paytm)", sector: "Consumer" },
  { symbol: "INDUSINDBK.NS", name: "IndusInd Bank", sector: "Banking" },
  { symbol: "PAGEIND.NS", name: "Page Industries", sector: "Consumer" },
];

export const TOTAL_STOCKS = nseStocks.length;

export function getStockBySymbol(symbol: string): NSEStockDef | undefined {
  return nseStocks.find((s) => s.symbol === symbol);
}

export function getSectors(): string[] {
  return [...new Set(nseStocks.map((s) => s.sector))].sort();
}

export function filterBySector(sector: string): NSEStockDef[] {
  if (!sector || sector === "All") return nseStocks;
  return nseStocks.filter((s) => s.sector === sector);
}
