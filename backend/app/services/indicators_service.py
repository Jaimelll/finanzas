import pandas as pd
import numpy as np
import logging
from ta.trend import SMAIndicator, EMAIndicator, MACD
from ta.momentum import RSIIndicator
from ta.volatility import AverageTrueRange

logger = logging.getLogger(__name__)

def calculate_supertrend(df: pd.DataFrame, period: int = 10, multiplier: float = 3.0) -> pd.Series:
    """
    Calculate Supertrend indicator.

    Args:
        df (pd.DataFrame): DataFrame with high, low, close columns
        period (int): ATR period
        multiplier (float): Multiplier for ATR

    Returns:
        pd.Series: Supertrend values
    """
    # Calculate ATR
    atr = AverageTrueRange(high=df['high'], low=df['low'], close=df['close'], window=period)
    df['atr'] = atr.average_true_range()

    # Calculate basic bands
    hl2 = (df['high'] + df['low']) / 2
    df['basic_upperband'] = hl2 + (multiplier * df['atr'])
    df['basic_lowerband'] = hl2 - (multiplier * df['atr'])

    # Initialize final bands
    df['final_upperband'] = 0.0
    df['final_lowerband'] = 0.0
    df['supertrend'] = 0.0
    df['trend'] = 0  # 1 for uptrend, -1 for downtrend

    for i in range(len(df)):
        if i == 0:
            df.loc[i, 'final_upperband'] = df.loc[i, 'basic_upperband']
            df.loc[i, 'final_lowerband'] = df.loc[i, 'basic_lowerband']
            if df.loc[i, 'close'] > df.loc[i, 'final_upperband']:
                df.loc[i, 'supertrend'] = df.loc[i, 'final_lowerband']
                df.loc[i, 'trend'] = 1
            else:
                df.loc[i, 'supertrend'] = df.loc[i, 'final_upperband']
                df.loc[i, 'trend'] = -1
        else:
            # Final upperband
            if df.loc[i, 'basic_upperband'] < df.loc[i-1, 'final_upperband'] or df.loc[i-1, 'close'] > df.loc[i-1, 'final_upperband']:
                df.loc[i, 'final_upperband'] = df.loc[i, 'basic_upperband']
            else:
                df.loc[i, 'final_upperband'] = df.loc[i-1, 'final_upperband']

            # Final lowerband
            if df.loc[i, 'basic_lowerband'] > df.loc[i-1, 'final_lowerband'] or df.loc[i-1, 'close'] < df.loc[i-1, 'final_lowerband']:
                df.loc[i, 'final_lowerband'] = df.loc[i, 'basic_lowerband']
            else:
                df.loc[i, 'final_lowerband'] = df.loc[i-1, 'final_lowerband']

            # Supertrend
            if df.loc[i, 'close'] > df.loc[i, 'final_upperband']:
                df.loc[i, 'supertrend'] = df.loc[i, 'final_lowerband']
                df.loc[i, 'trend'] = 1
            elif df.loc[i, 'close'] < df.loc[i, 'final_lowerband']:
                df.loc[i, 'supertrend'] = df.loc[i, 'final_upperband']
                df.loc[i, 'trend'] = -1
            else:
                df.loc[i, 'supertrend'] = df.loc[i-1, 'supertrend']
                df.loc[i, 'trend'] = df.loc[i-1, 'trend']

    return df['supertrend']

def calculate_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """
    Calculate swing trading indicators for the given DataFrame.

    Args:
        df (pd.DataFrame): DataFrame with OHLCV data

    Returns:
        pd.DataFrame: DataFrame with added indicator columns
    """
    min_periods = 20  # Minimum data points needed for indicators

    if len(df) < min_periods:
        # Not enough data for indicators, set to NaN
        df['sma_20'] = np.nan
        df['ema_20'] = np.nan
        df['rsi_14'] = np.nan
        df['macd'] = np.nan
        df['macd_signal'] = np.nan
        df['macd_histogram'] = np.nan
        df['supertrend'] = np.nan
        return df

    # SMA (20 period)
    sma = SMAIndicator(close=df['close'], window=20)
    df['sma_20'] = sma.sma_indicator()

    # EMA (20 period)
    ema = EMAIndicator(close=df['close'], window=20)
    df['ema_20'] = ema.ema_indicator()

    # RSI (14 period)
    rsi = RSIIndicator(close=df['close'], window=14)
    df['rsi_14'] = rsi.rsi()

    # MACD
    macd = MACD(close=df['close'])
    df['macd'] = macd.macd()
    df['macd_signal'] = macd.macd_signal()
    df['macd_histogram'] = macd.macd_diff()

    # Supertrend
    try:
        df['supertrend'] = calculate_supertrend(df, period=10, multiplier=3.0)
    except Exception as e:
        logger.error(f"Failed to calculate Supertrend: {str(e)}")
        df['supertrend'] = np.nan

    return df