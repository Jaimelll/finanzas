import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RsiChart = ({ data }) => {
  return (
    <div className="w-full h-48 mb-4">
      <h2 className="text-xl font-semibold mb-2">RSI Indicator</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
          />
          <YAxis domain={[0, 100]} />
          <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
          <Line type="monotone" dataKey="rsi_14" stroke="#ff7300" name="RSI 14" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RsiChart;