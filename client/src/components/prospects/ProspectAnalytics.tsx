import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, Clock, Target } from 'lucide-react';

// Mock data - will be replaced with real data from API
const stageConversionData = [
  { name: 'Initial Contact', value: 100 },
  { name: 'BOP', value: 85 },
  { name: 'Financial Review', value: 65 },
  { name: 'Needs Analysis', value: 45 },
  { name: 'Confidential Planning', value: 30 },
  { name: 'Training Sales', value: 20 },
  { name: 'Promotion Ready', value: 15 },
];

const timeInStageData = [
  { name: 'Initial Contact', avgDays: 3 },
  { name: 'BOP', avgDays: 7 },
  { name: 'Financial Review', avgDays: 14 },
  { name: 'Needs Analysis', avgDays: 10 },
  { name: 'Confidential Planning', avgDays: 21 },
  { name: 'Training Sales', avgDays: 30 },
  { name: 'Promotion Ready', avgDays: 14 },
];

const conversionTrendData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  rate: 30 + Math.random() * 20,
}));

const potentialDistributionData = [
  { name: 'High', value: 30, color: '#22c55e' },
  { name: 'Medium', value: 45, color: '#3b82f6' },
  { name: 'Low', value: 25, color: '#ef4444' },
];

const MetricCard = ({ title, value, trend, icon: Icon }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-2 bg-gray-100 rounded-full">
          <Icon className="w-4 h-4 text-gray-600" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center space-x-2">
          {trend > 0 ? (
            <ArrowUpRight className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${
            trend > 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {Math.abs(trend)}% vs last month
          </span>
        </div>
      )}
    </CardContent>
  </Card>
);

export const ProspectAnalytics = () => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Active Prospects"
          value="245"
          trend={12}
          icon={Users}
        />
        <MetricCard
          title="Avg. Conversion Time"
          value="45 days"
          trend={-5}
          icon={Clock}
        />
        <MetricCard
          title="Conversion Rate"
          value="32%"
          trend={8}
          icon={Target}
        />
      </div>

      {/* Stage Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Stage Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stageConversionData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time in Stage */}
        <Card>
          <CardHeader>
            <CardTitle>Average Time in Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timeInStageData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgDays" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Potential Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Potential Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={potentialDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {potentialDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Rate Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={conversionTrendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
