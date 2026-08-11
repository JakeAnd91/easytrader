
import { useState } from "react";
import "./App.css";
import { getStockData } from "./services/stockData";

function App() {
  const [search, setSearch] = useState("");
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);

  const searchStock = async (e) => {
    e.preventDefault();

    const symbol = search.trim().toUpperCase();

    if (!symbol) return;

    setLoading(true);
    setError("");
    setStocks([]);
    setSelectedStock(null);

    try {
      const data = await getStockData(symbol);

      const quote = data.quote;
      const fmpQuote = data.fmpQuote?.[0];

      if (!quote || !fmpQuote) {
        throw new Error("No stock data found.");
      }

      const stock = {
       symbol: quote.symbol,
       name: quote.name,
        price: Number(quote.close || fmpQuote.price || 0),
        change: Number(quote.change || fmpQuote.change || 0),
       changePercent:
         quote.percent_change ||
          String(fmpQuote.changePercentage || 0) + "%",
        volume: Number(quote.volume || fmpQuote.volume || 0),
        fundamentals: data.fundamentals?.[0] || {},
        news: data.news,
      };        

      setStocks([stock]);
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

            <button
              type="button"
              onClick={() => setSearch("AAPL")}
            >
              AAPL
            </button>

            <button
              type="button"
              onClick={() => setSearch("NVDA")}
            >
              NVDA
            </button>

            <button
              type="button"
              onClick={() => setSearch("TSLA")}
            >
              TSLA
            </button>

            <button
              type="button"
              onClick={() => setSearch("MSFT")}
            >
              MSFT
            </button>
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
                  <div
                    className="stock-card"
                    key={stock.symbol}
                  >
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
                        <strong>
                          {formatNumber(stock.volume)}
                        </strong>
                      </div>

                      <div>
                        <span>Symbol</span>
                        <strong>{stock.symbol}</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="view-button"
                      onClick={() => setSelectedStock(stock)}
                    >
                      View Details →
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {selectedStock && (
          <section className="stock-details">
            <div className="details-header">
              <div>
                <span className="details-symbol">
                  {selectedStock.symbol}
                </span>

                <h2>{selectedStock.name}</h2>
              </div>

              <button
                type="button"
                className="back-button"
                onClick={() => setSelectedStock(null)}
              >
                ← Back
              </button>
            </div>

            <div className="details-grid">
              <div className="detail-card">
                <span>Price</span>
                <strong>
                  ${selectedStock.price.toFixed(2)}
                </strong>
              </div>

              <div className="detail-card">
                <span>Change</span>

                <strong>
                  {selectedStock.change >= 0 ? "▲" : "▼"}{" "}
                  {Math.abs(selectedStock.change).toFixed(2)} (
                  {selectedStock.changePercent})
                </strong>
              </div>

              <div className="detail-card">
                <span>Volume</span>

                <strong>
                  {formatNumber(selectedStock.volume)}
                </strong>
              </div>
            </div>

            <div className="news-section">
              <h2>Latest News</h2>

              {selectedStock.news &&
              selectedStock.news.length > 0 ? (
                <div className="news-list">
                  {selectedStock.news
                    .slice(0, 5)
                    .map((article, index) => (
                      <article
                        className="news-card"
                        key={article.id || index}
                      >
                        <h3>{article.headline}</h3>

                        <p>{article.summary}</p>

                        <div className="news-meta">
                          <span>{article.source}</span>

                          {article.url && (
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Read article →
                            </a>
                          )}
                        </div>
                      </article>
                    ))}
                </div>
              ) : (
                <p>No recent news available.</p>
              )}
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

          <span>
            Market data powered by Twelve Data, FMP & Finnhub
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;