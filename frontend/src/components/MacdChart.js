import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Utility functions for axis formatting (consistent with other charts)
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
            tick={<CustomXAxisTick />}
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