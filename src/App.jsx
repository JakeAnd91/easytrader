
import { useState } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;

function App() {
  const [search, setSearch] = useState("");
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchStock = async (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    setLoading(true);
    setError("");
    setStocks([]);

    try {
      // First search for the company/ticker
      const searchResponse = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(
          search
        )}&apikey=${API_KEY}`
      );

      const searchData = await searchResponse.json();

      if (searchData.Note) {
        throw new Error(
          "API rate limit reached. Try again in a little while."
        );
      }

      if (!searchData.bestMatches || searchData.bestMatches.length === 0) {
        throw new Error("No stocks found.");
      }

      // Take the best 5 matches
      const matches = searchData.bestMatches.slice(0, 5);

      // Get quote information for each match
      const stockData = await Promise.all(
        matches.map(async (match) => {
          const symbol = match["1. symbol"];

          const quoteResponse = await fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
          );

          const quoteData = await quoteResponse.json();
          const quote = quoteData["Global Quote"];

          return {
            symbol,
            name: match["2. name"],
            price: Number(quote?.["05. price"] || 0),
            change: Number(quote?.["09. change"] || 0),
            changePercent: quote?.["10. change percent"] || "0%",
            volume: Number(quote?.["06. volume"] || 0),
          };
        })
      );

      setStocks(stockData);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-US").format(number);
  };

  return (
    <div className="app">
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <main className="container">
        <section className="hero">
          <div className="logo">
            <span className="logo-icon">↗</span>
            <span>StockFinder</span>
          </div>

          <h1>
            Find the market.
            <br />
            <span>Understand the stock.</span>
          </h1>

          <p className="subtitle">
            Search thousands of stocks and get market information instantly.
          </p>

          <form className="search-form" onSubmit={searchStock}>
            <span className="search-icon">⌕</span>

            <input
              type="text"
              placeholder="Search company or ticker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          <div className="popular">
            <span>Popular:</span>
            <button onClick={() => setSearch("AAPL")}>AAPL</button>
            <button onClick={() => setSearch("NVDA")}>NVDA</button>
            <button onClick={() => setSearch("TSLA")}>TSLA</button>
            <button onClick={() => setSearch("MSFT")}>MSFT</button>
          </div>
        </section>

        {error && (
          <div className="error">
            <span>⚠</span>
            {error}
          </div>
        )}

        {stocks.length > 0 && (
          <section className="results">
            <div className="results-header">
              <h2>Search Results</h2>
              <span>{stocks.length} stocks</span>
            </div>

            <div className="stock-grid">
              {stocks.map((stock) => {
                const positive = stock.change >= 0;

                return (
                  <div className="stock-card" key={stock.symbol}>
                    <div className="card-top">
                      <div className="ticker">
                        <div className="ticker-icon">
                          {stock.symbol.charAt(0)}
                        </div>

                        <div>
                          <h3>{stock.symbol}</h3>
                          <p>{stock.name}</p>
                        </div>
                      </div>

                      <span className="exchange">US</span>
                    </div>

                    <div className="stock-price">
                      <span className="price">
                        ${stock.price.toFixed(2)}
                      </span>

                      <span
                        className={`change ${
                          positive ? "positive" : "negative"
                        }`}
                      >
                        {positive ? "▲" : "▼"}{" "}
                        {Math.abs(stock.change).toFixed(2)} (
                        {stock.changePercent})
                      </span>
                    </div>

                    <div className="details">
                      <div>
                        <span>Volume</span>
                        <strong>{formatNumber(stock.volume)}</strong>
                      </div>

                      <div>
                        <span>Symbol</span>
                        <strong>{stock.symbol}</strong>
                      </div>
                    </div>

                    <button className="view-button">
                      View Details →
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {!loading && stocks.length === 0 && !error && (
          <div className="empty-state">
            <div className="empty-icon">⌁</div>
            <h3>Search for a stock</h3>
            <p>
              Enter a company name or ticker symbol above to get started.
            </p>
          </div>
        )}

        <footer>
          <span>StockFinder</span>
          <span>Market data powered by Alpha Vantage</span>
        </footer>
      </main>
    </div>
  );
}

export default App;

