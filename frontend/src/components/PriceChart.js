import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Utility functions for axis formatting
const formatPriceAxis = (value) => {
  if (typeof value !== 'number') return value;
  // Round to nearest thousand and format
  const rounded = Math.round(value / 1000) * 1000;
  return `${rounded.toLocaleString()} USD`;
};

// Custom X-axis tick component for proper time/date formatting
const CustomXAxisTick = ({ x, y, payload, index, visibleTicks }) => {
  const date = new Date(payload.value);
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  // Check if this is the first tick of a new day
  let showDate = false;
  if (index === 0) {
    showDate = true;
  } else if (visibleTicks && visibleTicks[index - 1]) {
    const prevDate = new Date(visibleTicks[index - 1].value);
    showDate = date.toDateString() !== prevDate.toDateString();
  }

  if (showDate) {
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={12} fontWeight="normal">
          {timeStr}
        </text>
        <text x={0} y={0} dy={32} textAnchor="middle" fill="#666" fontSize={10} fontWeight="normal">
          {dateStr}
        </text>
      </g>
    );
  }

  return (
    <text x={x} y={y} dy={16} textAnchor="middle" fill="#666" fontSize={12} fontWeight="normal">
      {timeStr}
    </text>
  );
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
            tick={<CustomXAxisTick />}
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