import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

export const fetchBitcoinData = async (interval = '1h', limit = 100) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bitcoin-data`, {
      params: { interval, limit }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Bitcoin data:', error);
    throw error;
  }
};