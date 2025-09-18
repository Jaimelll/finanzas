import pandas as pd
import numpy as np
import logging
import requests
from datetime import datetime, timedelta
from .indicators_service import calculate_indicators

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_mock_data(limit=100):
    """
    Generate mock OHLCV data for testing when API fails.

    Args:
        limit (int): Number of data points

    Returns:
        pd.DataFrame: Mock DataFrame with OHLCV data
    """
    logger.info(f"Generating mock data with {limit} points")

    # Generate timestamps (hourly intervals, starting from now backwards)
    end_time = datetime.now()
    timestamps = [end_time - timedelta(hours=i) for i in range(limit)]
    timestamps.reverse()  # Oldest first

    # Generate realistic BTC prices around $115,000
    base_price = 115000
    data = []

    for i, ts in enumerate(timestamps):
        # Add some random walk
        price_change = np.random.normal(0, 100)  # Mean 0, std 100
        current_price = base_price + price_change + (i * 10)  # Slight upward trend

        # Generate OHLC with some volatility
        volatility = abs(np.random.normal(0, 200))
        high = current_price + volatility
        low = current_price - volatility
        open_price = current_price + np.random.normal(0, 50)
        close = current_price + np.random.normal(0, 50)

        # Ensure high >= max(open, close), low <= min(open, close)
        high = max(high, open_price, close)
        low = min(low, open_price, close)

        volume = np.random.uniform(100, 1000)

        data.append({
            'timestamp': ts,
            'open': round(open_price, 2),
            'high': round(high, 2),
            'low': round(low, 2),
            'close': round(close, 2),
            'volume': round(volume, 2)
        })

    df = pd.DataFrame(data)
    latest_mock_price = df['close'].iloc[-1]
    logger.info(f"Mock data generated - latest price: ${latest_mock_price:,.2f}")
    return df

def get_bitcoin_data(interval='1h', limit=100):
    """
    Fetch Bitcoin OHLCV data from Binance API and calculate indicators.
    Falls back to mock data if API fails.

    Args:
        interval (str): Kline interval (e.g., '1h', '4h', '1d')
        limit (int): Number of data points to fetch

    Returns:
        pd.DataFrame: DataFrame with OHLCV and indicator columns
    """
    try:
        logger.info(f"Fetching Bitcoin data from Binance public API: interval={interval}, limit={limit}")
        url = f"https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval={interval}&limit={limit}"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        klines = response.json()

        if not klines:
            raise ValueError("No data returned from Binance API")

        # Convert to DataFrame
        df = pd.DataFrame(klines, columns=[
            'timestamp', 'open', 'high', 'low', 'close', 'volume',
            'close_time', 'quote_asset_volume', 'number_of_trades',
            'taker_buy_base_asset_volume', 'taker_buy_quote_asset_volume', 'ignore'
        ])

        # Process data
        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
        # Convert only numeric columns to float
        numeric_columns = ['open', 'high', 'low', 'close', 'volume']
        df[numeric_columns] = df[numeric_columns].astype(float)
        df = df[['timestamp'] + numeric_columns]

        # Log the latest price for verification
        latest_price = df['close'].iloc[-1]
        logger.info(f"Successfully fetched {len(df)} data points from Binance API")
        logger.info(f"Latest BTC/USDT price from Binance: ${latest_price:,.2f}")
        logger.info(f"Price range: ${df['low'].min():,.2f} - ${df['high'].max():,.2f}")

    except Exception as e:
        logger.error(f"Failed to fetch data from Binance API: {str(e)}")
        logger.warning("Binance API unavailable - falling back to mock data")
        df = generate_mock_data(limit)
        logger.info(f"Using mock data with {len(df)} data points")

    # Calculate indicators
    try:
        df = calculate_indicators(df)
        logger.info("Successfully calculated indicators")
    except Exception as e:
        logger.error(f"Failed to calculate indicators: {str(e)}")
        # Return data without indicators if calculation fails
        logger.warning("Returning data without indicators")

    return df