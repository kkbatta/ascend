import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
}

export const MetricsCard = ({ title, value, icon, trend }: MetricsCardProps) => (
  <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50">{icon}</div>
          <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-green-500">
            <ArrowUpRight size={16} />
            <span className="text-sm font-medium">{trend}%</span>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);
