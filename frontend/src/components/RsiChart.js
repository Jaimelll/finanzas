import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

const formatRsiAxis = (value) => {
  if (typeof value !== 'number') return value;
  return `${Math.round(value)}`;
};

const RsiChart = ({ data }) => {
  return (
    <div className="w-full h-48 mb-4">
      <h2 className="text-xl font-semibold mb-2">RSI Indicator</h2>
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
            domain={[0, 100]}
            tickFormatter={formatRsiAxis}
            ticks={[0, 20, 30, 70, 80, 100]}
            width={60}
          />
          <Tooltip
            labelFormatter={(label) => new Date(label).toLocaleString()}
            formatter={(value, name) => [
              typeof value === 'number' ? `${value.toFixed(2)}` : value,
              name
            ]}
          />
          <Line type="monotone" dataKey="rsi_14" stroke="#ff7300" name="RSI 14" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RsiChart;