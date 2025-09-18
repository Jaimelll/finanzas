import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Utility functions for axis formatting
const formatPriceAxis = (value) => {
  if (typeof value !== 'number') return value;
  // Round to nearest thousand and format
  const rounded = Math.round(value / 1000) * 1000;
  return `${rounded.toLocaleString()} USD`;
};

const formatTimeAxis = (tick, index, ticks) => {
  const date = new Date(tick);
  const hour = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  // Check if this is the first tick of a new day
  let showDate = false;
  if (index === 0) {
    showDate = true;
  } else if (ticks && ticks[index - 1]) {
    const prevDate = new Date(ticks[index - 1]);
    showDate = date.toDateString() !== prevDate.toDateString();
  }

  if (showDate) {
    const day = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${hour}\n${day}`;
  }

  return hour;
};

const calculatePriceDomain = (data) => {
  if (!data || data.length === 0) return [110000, 120000];

  const prices = data.flatMap(item => [
    item.close,
    item.sma_20,
    item.ema_20,
    item.supertrend
  ].filter(price => typeof price === 'number' && !isNaN(price)));

  if (prices.length === 0) return [110000, 120000];

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Round to nearest thousand and add padding
  const minRounded = Math.floor(minPrice / 1000) * 1000;
  const maxRounded = Math.ceil(maxPrice / 1000) * 1000;
  const range = maxRounded - minRounded;
  const padding = Math.max(1000, range * 0.1); // At least 1000 padding

  return [minRounded - padding, maxRounded + padding];
};

const generatePriceTicks = (domain) => {
  const [min, max] = domain;
  const range = max - min;
  const step = Math.ceil(range / 5000) * 1000; // Step in thousands, aiming for ~6 ticks

  const ticks = [];
  let current = Math.ceil(min / 1000) * 1000;

  while (current <= max) {
    ticks.push(current);
    current += step;
  }

  return ticks;
};

const PriceChart = ({ data }) => {
  const priceDomain = calculatePriceDomain(data);

  return (
    <div className="w-full h-96 mb-4">
      <h2 className="text-xl font-semibold mb-2">Price Chart with Indicators</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTimeAxis}
            height={80}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={priceDomain}
            tickFormatter={formatPriceAxis}
            width={120}
            ticks={generatePriceTicks(priceDomain)}
          />
          <Tooltip
            labelFormatter={(label) => new Date(label).toLocaleString()}
            formatter={(value, name) => [
              typeof value === 'number' ? `${value.toLocaleString()} USD` : value,
              name
            ]}
          />
          <Legend />
          <Line type="monotone" dataKey="close" stroke="#8884d8" name="Close Price" />
          <Line type="monotone" dataKey="sma_20" stroke="#82ca9d" name="SMA 20" />
          <Line type="monotone" dataKey="ema_20" stroke="#ffc658" name="EMA 20" />
          <Line type="monotone" dataKey="supertrend" stroke="#ff7300" name="Supertrend" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;