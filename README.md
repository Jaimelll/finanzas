# Bitcoin Swing Trading Dashboard

## Overview

A full-stack web application for Bitcoin swing trading analysis featuring real-time data visualization and comprehensive technical indicators.

## Features

- **Real-time Data**: Bitcoin OHLCV data fetched from Binance API
- **Technical Indicators**:
  - Moving Averages (SMA, EMA)
  - Relative Strength Index (RSI)
  - Moving Average Convergence Divergence (MACD)
  - Supertrend
  - Volume Analysis
- **Interactive Charts**:
  - Price line chart with indicator overlays
  - Volume bar chart
  - RSI indicator panel
  - MACD indicator panel
- **Auto-refresh**: Configurable refresh interval (default 5 minutes)
- **Navigation**: Switch between different chart views
- **Mobile-responsive**: Optimized for all device sizes
- **Containerized**: Easy deployment with Docker

## Tech Stack

- **Backend**: Python 3.9, FastAPI, pandas, ta (technical analysis)
- **Frontend**: React 18, TailwindCSS, Recharts, Axios
- **Infrastructure**: Docker, Docker Compose

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bitcoin-trading-dashboard
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the dashboard**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## API Endpoints

### GET /api/bitcoin-data
Fetch Bitcoin OHLCV data with calculated indicators.

**Parameters:**
- `interval` (string): Time interval (default: '1h')
- `limit` (int): Number of data points (default: 100)

**Response:**
```json
{
  "data": [
    {
      "timestamp": "2023-...",
      "open": 45000,
      "high": 46000,
      "low": 44000,
      "close": 45500,
      "volume": 1234.56,
      "sma_20": 45200,
      "ema_20": 45300,
      "rsi_14": 65.5,
      "macd": 150,
      "macd_signal": 140,
      "macd_histogram": 10,
      "supertrend": 44800
    }
  ]
}
```

## Development Setup

### Backend Development

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

```bash
cd frontend
npm install
npm start
```

The frontend will proxy API requests to the backend.

## Configuration

- **Refresh Interval**: Adjustable in the UI (in minutes, default: 5)
- **Data Interval**: Modify the `interval` parameter in API calls (default: '1h')
- **API Base URL**: Set `REACT_APP_API_BASE_URL` environment variable for frontend (default: http://localhost:8000/api for development, automatically configured for Docker)
- **Fallback Data**: If Binance API is unavailable, the backend automatically provides mock data for testing

## Environment Variables

- `REACT_APP_API_BASE_URL`: Frontend API endpoint (optional, defaults handled automatically)

## Project Structure

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
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Troubleshooting

- **Port conflicts**: Ensure ports 3000 and 8000 are available
- **API errors**: Check Binance API status and network connectivity
- **Build issues**: Clear Docker cache with `docker system prune`

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request