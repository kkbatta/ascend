import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Award, TrendingUp } from 'lucide-react';

interface OrgMember {
  id: string;
  name: string;
  designation: string;
  compensationPercentage: number;
  bonusPercentage?: number;
  yearlyIncome: number;
  children?: OrgMember[];
  level: number;
}

interface UnilevelOrgChartProps {
  data: OrgMember;
}

const designationColors = {
  'CEO': 'bg-purple-100 text-purple-800',
  'CEOMD': 'bg-indigo-100 text-indigo-800',
  'RMD': 'bg-blue-100 text-blue-800',
  'MD': 'bg-cyan-100 text-cyan-800',
  'SFC': 'bg-emerald-100 text-emerald-800',
  'SEFC': 'bg-teal-100 text-teal-800',
  'Associate': 'bg-gray-100 text-gray-800'
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const MemberNode: React.FC<{ member: OrgMember }> = ({ member }) => {
  return (
    <div className="flex flex-col items-center">
      <Card className="w-72 hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <Badge className={designationColors[member.designation as keyof typeof designationColors]}>
                {member.designation}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1">
                <TrendingUp size={16} className="text-green-500" />
                <span>{member.compensationPercentage}% Comp</span>
              </div>
              {member.bonusPercentage && (
                <div className="flex items-center gap-1">
                  <Award size={16} className="text-amber-500" />
                  <span>{member.bonusPercentage}% Bonus</span>
                </div>
              )}
              <div className="col-span-2 flex items-center gap-1 text-base font-medium">
                <Users size={16} className="text-blue-500" />
                <span>{formatCurrency(member.yearlyIncome)}/year</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {member.children && member.children.length > 0 && (
        <div className="relative mt-4">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-4 bg-gray-300"></div>
          <div className="flex gap-8">
            {member.children.map((child, index) => (
              <div key={child.id} className="relative">
                {index > 0 && (
                  <div className="absolute top-0 left-0 w-full h-px bg-gray-300 -translate-y-4"></div>
                )}
                <MemberNode member={child} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const UnilevelOrgChart: React.FC<UnilevelOrgChartProps> = ({ data }) => {
  return (
    <div className="p-8 overflow-x-auto">
      <MemberNode member={data} />
    </div>
  );
};
