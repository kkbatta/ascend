import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addMonths, format, startOfMonth, endOfMonth } from "date-fns";

const productTypes = [
  'All',
  'Indexed Universal Life',
  'Fixed Annuity',
  'Variable Annuity',
  'Term Life',
  'Whole Life'
];

const providers = [
  'North American',
  'Athene',
  'Nationwide'
];

// Generate mock data for the last 12 months
const generateMockData = () => {
  const mockData: Array<{
    date: string;
    provider: string;
    revenue: number;
    policyCount: number;
    averagePremium: number;
    productType: string;
  }> = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = addMonths(now, -i);
    providers.forEach(provider => {
      mockData.push({
        date: format(date, 'yyyy-MM'),
        provider,
        revenue: Math.floor(Math.random() * 1000000) + 500000,
        policyCount: Math.floor(Math.random() * 100) + 50,
        averagePremium: Math.floor(Math.random() * 5000) + 2000,
        productType: productTypes[Math.floor(Math.random() * productTypes.length)]
      });
    });
  }
  return mockData;
};

export const ProviderMetricsReport = () => {
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(addMonths(new Date(), -6)),
    to: endOfMonth(new Date())
  });
  const [selectedProductType, setSelectedProductType] = useState('All');

  const { data: metrics = [] } = useQuery({
    queryKey: ['providerMetrics', dateRange, selectedProductType],
    queryFn: async () => {
      // In a real app, this would be an API call
      const allData = generateMockData();
      return allData.filter(item => {
        const itemDate = new Date(item.date);
        return (
          itemDate >= dateRange.from &&
          itemDate <= dateRange.to &&
          (selectedProductType === 'All' || item.productType === selectedProductType)
        );
      });
    }
  });

  const transformedData = providers.map(provider => {
    const providerMetrics = metrics.filter(m => m.provider === provider);
    const totalRevenue = providerMetrics.reduce((sum, m) => sum + m.revenue, 0);
    const totalPolicies = providerMetrics.reduce((sum, m) => sum + m.policyCount, 0);
    const avgPremium = Math.round(totalRevenue / totalPolicies);

    return {
      provider,
      revenue: totalRevenue,
      policies: totalPolicies,
      avgPremium: avgPremium || 0
    };
  });

  const formatYAxis = (value: number, metric: string) => {
    if (metric === 'revenue') {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (metric === 'policies') {
      return value.toFixed(0);
    } else {
      return `$${value.toLocaleString()}`;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {
                entry.name === 'Revenue' ? `$${entry.value.toLocaleString()}` :
                entry.name === 'Policies' ? entry.value.toLocaleString() :
                `$${entry.value.toLocaleString()}`
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Provider Business Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <DatePickerWithRange
              date={dateRange}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  setDateRange({ from: range.from, to: range.to });
                }
              }}
            />
            <Select
              value={selectedProductType}
              onValueChange={setSelectedProductType}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                {productTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transformedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="provider" />
                <YAxis 
                  yAxisId="revenue"
                  orientation="left"
                  tickFormatter={(value) => formatYAxis(value, 'revenue')}
                />
                <YAxis 
                  yAxisId="policies"
                  orientation="right"
                  tickFormatter={(value) => formatYAxis(value, 'policies')}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  yAxisId="revenue"
                  dataKey="revenue" 
                  name="Revenue" 
                  fill="#8884d8" 
                />
                <Bar 
                  yAxisId="policies"
                  dataKey="policies" 
                  name="Policies" 
                  fill="#82ca9d" 
                />
                <Bar 
                  yAxisId="revenue"
                  dataKey="avgPremium" 
                  name="Avg Premium" 
                  fill="#ffc658" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};