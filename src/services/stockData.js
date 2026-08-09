const TWELVE_DATA_KEY = import.meta.env.VITE_TWELVE_DATA_KEY;
const FMP_KEY = import.meta.env.VITE_FMP_KEY;
const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_KEY;


export async function getQuote(symbol) {
  const response = await fetch(
    `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${TWELVE_DATA_KEY}`
  );

  const data = await response.json();

  return data;
}


export async function getFMPQuote(symbol) {
  const response = await fetch(
    `https://financialmodelingprep.com/stable/quote?symbol=${symbol}&apikey=${FMP_KEY}`
  );

  const data = await response.json();

  return data;
}


export async function getNews(symbol) {
  const response = await fetch(
    `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=2026-08-01&to=2026-08-08&token=${FINNHUB_KEY}`
  );

  const data = await response.json();

  return data;
}


export async function getStockData(symbol) {
  const [quote, fmpQuote, news] = await Promise.all([
    getQuote(symbol),
    getFMPQuote(symbol),
    getNews(symbol),
  ]);

  return {
    quote,
    fmpQuote,
    news,
  };
}

