import React from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface ProgressPoint {
  date: string;
  score: number;
  concentration: number;
}

interface ProgressChartProps {
  data: ProgressPoint[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={260}>
    <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="score" stroke="#3182CE" strokeWidth={2} dot={{ r: 3 }} name="训练得分" />
      <Line type="monotone" dataKey="concentration" stroke="#38A169" strokeWidth={2} dot={{ r: 3 }} name="专注度" />
    </LineChart>
  </ResponsiveContainer>
);

export default React.memo(ProgressChart);
