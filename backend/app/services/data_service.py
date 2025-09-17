import pandas as pd
import numpy as np
import logging
from datetime import datetime, timedelta
from binance.client import Client
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

    # Generate realistic BTC prices around $60,000
    base_price = 60000
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
        logger.info(f"Fetching Bitcoin data from Binance API: interval={interval}, limit={limit}")
        client = Client(api_key='', api_secret='')  # Public API, no key required
        klines = client.get_klines(symbol='BTCUSDT', interval=interval, limit=limit)

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
        df = df[['timestamp', 'open', 'high', 'low', 'close', 'volume']].astype(float)

        logger.info(f"Successfully fetched {len(df)} data points from Binance API")

    except Exception as e:
        logger.error(f"Failed to fetch data from Binance API: {str(e)}")
        logger.info("Falling back to mock data")
        df = generate_mock_data(limit)

    # Calculate indicators
    try:
        df = calculate_indicators(df)
        logger.info("Successfully calculated indicators")
    except Exception as e:
        logger.error(f"Failed to calculate indicators: {str(e)}")
        # Return data without indicators if calculation fails
        logger.warning("Returning data without indicators")

    return df