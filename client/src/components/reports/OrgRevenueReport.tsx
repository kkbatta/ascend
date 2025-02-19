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
      const response = await fetch(`/api/reports/org-revenue?` + new URLSearchParams({
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString()
      }));
      if (!response.ok) throw new Error('Failed to fetch organization revenue');
      return response.json();
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
            onSelect={setDateRange}
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
