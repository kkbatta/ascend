import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface BusinessValueChartProps {
  data: Array<{
    month: string;
    actual: number;
    target: number;
    projected: number;
  }>;
}

export const BusinessValueChart = ({ data }: BusinessValueChartProps) => (
  <div className="h-80">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#6366F1"
          strokeWidth={2}
          name="Actual Business"
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="#EC4899"
          strokeWidth={2}
          strokeDasharray="5 5"
          name="Target"
        />
        <Line
          type="monotone"
          dataKey="projected"
          stroke="#8B5CF6"
          strokeWidth={2}
          name="Projected"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
