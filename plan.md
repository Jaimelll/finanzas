# Bitcoin Swing Trading Dashboard - Architecture Plan

## System Overview

This full-stack application provides a comprehensive Bitcoin swing trading dashboard with real-time data visualization and technical indicators.

### Components:
- **Backend (FastAPI)**: Handles data fetching from Binance API, calculates swing trading indicators (SMA, EMA, RSI, MACD, Supertrend), and serves RESTful API endpoints.
- **Frontend (React + TailwindCSS)**: Responsive web interface that consumes backend APIs and renders interactive charts using Recharts.
- **Containerization (Docker)**: Separate containers for backend and frontend, orchestrated via Docker Compose for easy deployment.

### Key Features:
- Real-time Bitcoin OHLCV data from Binance API
- Technical indicators: Moving Averages (SMA/EMA), RSI, MACD, Volume Analysis, Supertrend
- Multiple chart types: Price line chart with overlays, volume bar chart, RSI/MACD panels
- Auto-refresh functionality (configurable interval)
- Mobile-responsive dashboard with navigation
- Clean, modern UI using TailwindCSS

## Architecture Diagram

```mermaid
graph TD
    A[React Frontend<br/>Port 3000] -->|HTTP API calls| B[FastAPI Backend<br/>Port 8000]
    B -->|Fetch OHLCV data| C[Binance API<br/>(External)]
    B -->|Process & calculate| D[Indicator Engine<br/>SMA, EMA, RSI, MACD, Supertrend]
    A -->|Render charts| E[Recharts Components<br/>Line/Bar/Panels]
    F[Docker Compose] -->|Container orchestration| A
    F -->|Container orchestration| B
    G[User Browser] -->|Access dashboard| A
```

## Data Flow:
1. Frontend loads and requests data from backend
2. Backend fetches latest Bitcoin data from Binance API
3. Backend calculates all required indicators
4. Backend returns processed data to frontend
5. Frontend renders charts and updates UI
6. Auto-refresh triggers periodic data updates

## Technology Stack:
- **Backend**: Python 3.9+, FastAPI, requests, pandas, numpy, ta (technical analysis library)
- **Frontend**: React 18+, TailwindCSS, Recharts, Axios
- **Infrastructure**: Docker, Docker Compose
- **API**: Binance Public API (free tier)

## Project Structure:
```
bitcoin-trading-dashboard/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   └── services/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Implementation Phases:
1. Project setup and structure
2. Backend development (API integration, indicators)
3. Frontend development (UI, charts)
4. Containerization and deployment
5. Testing and documentation