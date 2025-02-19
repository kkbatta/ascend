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
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addMonths, startOfMonth, endOfMonth } from "date-fns";

export const OrgRevenueReport = () => {
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(addMonths(new Date(), -6)),
    to: endOfMonth(new Date())
  });

  const { data: orgRevenue = [] } = useQuery({
    queryKey: ['organizationRevenue', dateRange],
    queryFn: async () => {
      // In a real app, this would be an API call
      // For now, we'll return mock data based on our organization structure
      return [
        {
          name: 'RMD Super Base',
          revenue: 8850000,
          commissions: 2655000,
          newPolicies: 1250000,
          renewals: 4945000
        },
        {
          name: 'RMD Base Shop',
          revenue: 2485000,
          commissions: 745500,
          newPolicies: 850000,
          renewals: 889500
        },
        {
          name: 'Base Shop',
          revenue: 568000,
          commissions: 170400,
          newPolicies: 225000,
          renewals: 172600
        },
        {
          name: 'Personal Team',
          revenue: 95000,
          commissions: 28500,
          newPolicies: 45000,
          renewals: 21500
        }
      ];
    }
  });

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Organization Revenue Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DatePickerWithRange
            date={dateRange}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                setDateRange({ from: range.from, to: range.to });
              }
            }}
          />

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orgRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                <Bar dataKey="commissions" name="Commissions" fill="#82ca9d" />
                <Bar dataKey="newPolicies" name="New Policies" fill="#ffc658" />
                <Bar dataKey="renewals" name="Renewals" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};