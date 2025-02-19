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
  const mockData = [];
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
      // For now, we'll return our generated mock data
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

  const transformedData = providers.map(provider => ({
    provider,
    revenue: metrics
      .filter(m => m.provider === provider)
      .reduce((sum, m) => sum + m.revenue, 0),
    policies: metrics
      .filter(m => m.provider === provider)
      .reduce((sum, m) => sum + m.policyCount, 0),
    avgPremium: metrics
      .filter(m => m.provider === provider)
      .reduce((sum, m) => sum + m.averagePremium, 0) / 
      metrics.filter(m => m.provider === provider).length || 0
  }));

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
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                <Bar dataKey="policies" name="Policies" fill="#82ca9d" />
                <Bar dataKey="avgPremium" name="Avg Premium" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};