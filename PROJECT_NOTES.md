# StockFinder — Project Notes

**Last updated:** August 8, 2026

## What This Project Is

StockFinder is a Yahoo Finance-style stock analysis website designed to do more than show stock numbers.

The goal is to **teach the user what the numbers mean** and give them an easy-to-understand assessment of a stock.

---

## What I've Done

* Created the React/Vite website
* Created stock search
* Connected Alpha Vantage
* Connected Twelve Data
* Connected Financial Modeling Prep (FMP)
* Connected Finnhub
* Created `.env` for API keys
* Added `.env` to `.gitignore` so API keys don't get uploaded to GitHub
* Created `src/services/stockData.js`
* Set up Git
* Created a Git commit
* Successfully pushed the project to GitHub

**Important:** API keys are stored in `.env`. NEVER upload `.env` to GitHub.

---

## Where I Am Now

### Phase 1 — Multi-Provider Data Layer

I am replacing the original Alpha Vantage-only system with a system that uses three different providers.

The idea is that each provider does the things it is best suited for.

### Twelve Data

Used for:

* Price history
* Price charts
* Moving averages
* RSI
* MACD
* Other technical indicators

### Financial Modeling Prep (FMP)

Used for:

* P/E
* EPS
* Debt
* Margins
* Other financial fundamentals
* Sector averages

### Finnhub

Used for:

* Real-time quotes
* News headlines

---

## How the Data System Works

Instead of:

```
Website → Alpha Vantage → Data
```

I want:

```
Website
   ↓
stockData.js
   ↓
┌──────────────┬──────────────┬──────────────┐
↓              ↓              ↓
Twelve Data    FMP            Finnhub
↓              ↓              ↓
Technical      Fundamentals   Quotes + News
```

`stockData.js` acts as the middleman between the website and the different data providers.

---

## Important Design Ideas

Some financial measurements should be compared against the company's **sector**, because what is considered "normal" varies between industries.

For example:

* A normal P/E for a technology company may be very different from a normal P/E for a bank.
* Debt levels can also vary significantly between industries.

Other measurements, such as EPS growth, can use a more general market-wide grading scale.

---

## Stock Recommendation

The website will eventually show something like:

**BUY / HOLD / SELL**

This is **our own scoring system**, created by combining the different financial and technical grades.

It is a **heuristic**, not professional analyst advice.

The website should make that clear to the user.

---

# Build Order

### Phase 1 — Multi-provider data layer

**CURRENT STEP**

Get Twelve Data, FMP, and Finnhub working through `stockData.js`.

### Phase 2 — Main Header + Price Graph

Build the main stock page and display the stock's price history visually.

### Phase 3 — Recommendation + Color-Coded Stats

Create the scoring system and display understandable grades.

### Phase 4 — Fundamental Analysis

Show things such as:

* P/E
* EPS
* Revenue
* Profit margins
* Debt
* Growth
* Sector comparisons

### Phase 5 — Technical Analysis

Add:

* Moving averages
* Golden cross
* Death cross
* RSI
* MACD
* Volume compared with average volume

### Phase 6 — News

Add:

* News headlines
* News strip
* Links to relevant articles

### Phase 7 — Later Features

Eventually consider:

* Options activity
* Short interest
* Odd-lot activity
* Stochastic oscillator
* Other advanced indicators

---

# Git / GitHub

Git is being used to save versions of the project.

### Check what changed

```
git status
```

### Prepare changes for a commit

```
git add .
```

### Save a version

```
git commit -m "Describe what changed"
```

### Upload the commit to GitHub

```
git push
```

### Important

`.env` contains private API keys and must remain excluded from GitHub.

---

# Where To Start Next Time

Open:

```
src/services/stockData.js
```

Then tell ChatGPT:

> "Let's continue StockFinder. We were working on Phase 1 and had just set up GitHub."

The next task is to understand what `stockData.js` currently does and then build the multi-provider data service together.

## Learning Goal

I don't need to memorize programming languages or coding syntax.

I want to understand **how the pieces work together** so that I become competent enough to build and modify the project myself.

ChatGPT should explain what we're doing in plain English before having me change code.
