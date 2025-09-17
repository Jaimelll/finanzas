import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MacdChart = ({ data }) => {
  return (
    <div className="w-full h-48 mb-4">
      <h2 className="text-xl font-semibold mb-2">MACD Indicator</h2>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
          />
          <YAxis />
          <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
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