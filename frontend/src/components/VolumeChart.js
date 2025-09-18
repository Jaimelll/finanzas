import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Utility functions for axis formatting (consistent with PriceChart)
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

const formatVolumeAxis = (value) => {
  if (typeof value !== 'number') return value;
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
};

const calculateVolumeDomain = (data) => {
  if (!data || data.length === 0) return [0, 1000];

  const volumes = data
    .map(item => item.volume)
    .filter(volume => typeof volume === 'number' && !isNaN(volume));

  if (volumes.length === 0) return [0, 1000];

  const maxVolume = Math.max(...volumes);
  const padding = maxVolume * 0.1; // 10% padding

  return [0, maxVolume + padding];
};

const generateVolumeTicks = (domain) => {
  const [min, max] = domain;
  const range = max - min;
  const step = Math.ceil(range / 6); // Aim for about 6 ticks

  const ticks = [];
  let current = Math.ceil(min / step) * step;

  while (current <= max) {
    ticks.push(current);
    current += step;
  }

  return ticks;
};

const VolumeChart = ({ data }) => {
  const volumeDomain = calculateVolumeDomain(data);

  return (
    <div className="w-full h-48 mb-4">
      <h2 className="text-xl font-semibold mb-2">Volume Chart</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTimeAxis}
            height={80}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={volumeDomain}
            tickFormatter={formatVolumeAxis}
            width={80}
            ticks={generateVolumeTicks(volumeDomain)}
          />
          <Tooltip
            labelFormatter={(label) => new Date(label).toLocaleString()}
            formatter={(value, name) => [
              typeof value === 'number' ? value.toLocaleString() : value,
              name
            ]}
          />
          <Bar dataKey="volume" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VolumeChart;