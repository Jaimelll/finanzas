import React, { useState, useEffect } from 'react';
import { fetchBitcoinData } from '../services/api';
import PriceChart from './PriceChart';
import VolumeChart from './VolumeChart';
import RsiChart from './RsiChart';
import MacdChart from './MacdChart';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(300000); // 5 minutes in ms
  const [activeChart, setActiveChart] = useState('all');

  const fetchData = async () => {
    try {
      const result = await fetchBitcoinData();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const renderChart = () => {
    switch (activeChart) {
      case 'price':
        return <PriceChart data={data} />;
      case 'volume':
        return <VolumeChart data={data} />;
      case 'rsi':
        return <RsiChart data={data} />;
      case 'macd':
        return <MacdChart data={data} />;
      default:
        return (
          <div className="grid grid-cols-1 gap-4">
            <PriceChart data={data} />
            <VolumeChart data={data} />
            <RsiChart data={data} />
            <MacdChart data={data} />
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-2 sm:mb-0">
          <label className="mr-2 text-sm font-medium">Refresh Interval (minutes):</label>
          <input
            type="number"
            value={refreshInterval / 60000}
            onChange={(e) => setRefreshInterval(Number(e.target.value) * 60000)}
            className="border border-gray-300 rounded px-2 py-1 w-20"
            min="1"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'price', 'volume', 'rsi', 'macd'].map((chart) => (
            <button
              key={chart}
              onClick={() => setActiveChart(chart)}
              className={`px-3 py-1 rounded capitalize ${
                activeChart === chart
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {chart}
            </button>
          ))}
        </div>
      </div>
      {renderChart()}
    </div>
  );
};

export default Dashboard;