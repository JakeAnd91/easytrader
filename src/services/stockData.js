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