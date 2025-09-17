from fastapi import APIRouter, HTTPException
from app.services.data_service import get_bitcoin_data

router = APIRouter()

@router.get("/bitcoin-data")
def get_data(interval: str = '1h', limit: int = 100):
    """
    Get Bitcoin OHLCV data from Binance.

    Args:
        interval (str): Time interval for data (e.g., '1h', '4h', '1d')
        limit (int): Number of data points to return

    Returns:
        dict: Dictionary containing the data as list of records
    """
    try:
        df = get_bitcoin_data(interval, limit)
        # Replace NaN with None for JSON compatibility
        df = df.replace({float('nan'): None})
        return {"data": df.to_dict('records')}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))