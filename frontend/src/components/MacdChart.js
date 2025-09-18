import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Utility functions for axis formatting (consistent with other charts)
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

const formatMacdAxis = (value) => {
  if (typeof value !== 'number') return value;
  return value.toFixed(2);
};

const calculateMacdDomain = (data) => {
  if (!data || data.length === 0) return [-1000, 1000];

  const macdValues = data.flatMap(item => [
    item.macd,
    item.macd_signal,
    item.macd_histogram
  ].filter(val => typeof val === 'number' && !isNaN(val)));

  if (macdValues.length === 0) return [-1000, 1000];

  const minValue = Math.min(...macdValues);
  const maxValue = Math.max(...macdValues);
  const padding = Math.max(Math.abs(minValue), Math.abs(maxValue)) * 0.1; // 10% padding

  return [minValue - padding, maxValue + padding];
};

const generateMacdTicks = (domain) => {
  const [min, max] = domain;
  const range = max - min;
  const step = range / 6; // Aim for about 6 ticks

  const ticks = [];
  let current = Math.ceil(min / step) * step;

  while (current <= max) {
    ticks.push(current);
    current += step;
  }

  return ticks;
};

const MacdChart = ({ data }) => {
  const macdDomain = calculateMacdDomain(data);

  return (
    <div className="w-full h-48 mb-4">
      <h2 className="text-xl font-semibold mb-2">MACD Indicator</h2>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTimeAxis}
            height={80}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={macdDomain}
            tickFormatter={formatMacdAxis}
            width={80}
            ticks={generateMacdTicks(macdDomain)}
          />
          <Tooltip
            labelFormatter={(label) => new Date(label).toLocaleString()}
            formatter={(value, name) => [
              typeof value === 'number' ? value.toFixed(4) : value,
              name
            ]}
          />
          <Legend />
          <Line type="monotone" dataKey="macd" stroke="#8884d8" name="MACD" />
          <Line type="monotone" dataKey="macd_signal" stroke="#82ca9d" name="Signal" />
          <Bar dataKey="macd_histogram" fill="#ffc658" name="Histogram" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MacdChart;