import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Award, TrendingUp, Star } from 'lucide-react';

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
  'CEO': 'bg-purple-100 text-purple-800 border-purple-300',
  'CEOMD': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  'RMD': 'bg-blue-100 text-blue-800 border-blue-300',
  'MD': 'bg-cyan-100 text-cyan-800 border-cyan-300',
  'SFC': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'SEFC': 'bg-teal-100 text-teal-800 border-teal-300',
  'Associate': 'bg-gray-100 text-gray-800 border-gray-300'
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
      <Card className="w-72 hover:shadow-lg transition-shadow border-2 border-opacity-50">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <Badge 
                className={`${designationColors[member.designation as keyof typeof designationColors]} border px-2 py-1`}
              >
                {member.designation}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1 bg-blue-50 p-2 rounded-lg">
                <TrendingUp size={16} className="text-blue-500" />
                <span className="font-medium">{member.compensationPercentage}% Comp</span>
              </div>
              {member.bonusPercentage && (
                <div className="flex items-center gap-1 bg-amber-50 p-2 rounded-lg">
                  <Star size={16} className="text-amber-500" />
                  <span className="font-medium">{member.bonusPercentage}% Bonus</span>
                </div>
              )}
              <div className="col-span-2 flex items-center gap-1 bg-green-50 p-2 rounded-lg">
                <Users size={16} className="text-green-500" />
                <span className="font-medium">{formatCurrency(member.yearlyIncome)}/year</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {member.children && member.children.length > 0 && (
        <div className="relative mt-8">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-0.5 h-8 bg-gray-300"></div>
          <div className="relative flex gap-12 pt-8">
            {member.children.map((child, index, array) => (
              <div key={child.id} className="relative">
                {/* Horizontal connecting line */}
                {array.length > 1 && (
                  <div 
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 h-0.5 bg-gray-300"
                    style={{
                      width: index === 0 ? '50%' : index === array.length - 1 ? '50%' : '100%',
                      left: index === 0 ? '50%' : index === array.length - 1 ? '0' : '50%'
                    }}
                  />
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
    <div className="p-8 overflow-x-auto min-w-max">
      <MemberNode member={data} />
    </div>
  );
};