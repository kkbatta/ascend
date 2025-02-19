import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface BusinessValueChartProps {
  data: Array<{
    month: string;
    personal: number;
    team: number;
    target: number;
  }>;
  showTarget?: boolean;
}

export const BusinessValueChart = ({ data, showTarget = true }: BusinessValueChartProps) => {
  const currentTarget = data[data.length - 1]?.target || 0;

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => ['$' + value.toLocaleString(), '']}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="personal"
            name="Personal Production"
            stroke="#3b82f6"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="team"
            name="Team Production"
            stroke="#8b5cf6"
            strokeWidth={2}
          />
          {showTarget && (
            <>
              <Line
                type="monotone"
                dataKey="target"
                name="Target"
                stroke="#ef4444"
                strokeDasharray="5 5"
              />
              <ReferenceLine
                y={currentTarget}
                label="Current Target"
                stroke="#ef4444"
                strokeDasharray="3 3"
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};