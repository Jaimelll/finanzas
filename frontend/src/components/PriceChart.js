import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PriceChart = ({ data }) => {
  return (
    <div className="w-full h-96 mb-4">
      <h2 className="text-xl font-semibold mb-2">Price Chart with Indicators</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
          />
          <YAxis />
          <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
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