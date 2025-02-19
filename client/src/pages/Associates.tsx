import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UnilevelOrgChart } from '@/components/mlm/UnilevelOrgChart';

const mockOrgData = {
  id: '1',
  name: 'John Maxwell',
  designation: 'CEO',
  compensationPercentage: 78,
  bonusPercentage: 15,
  yearlyIncome: 1250000,
  level: 1,
  children: [
    {
      id: '2',
      name: 'Sarah Johnson',
      designation: 'CEOMD',
      compensationPercentage: 72,
      bonusPercentage: 12,
      yearlyIncome: 850000,
      level: 2,
      children: [
        {
          id: '4',
          name: 'Michael Chen',
          designation: 'RMD',
          compensationPercentage: 65,
          bonusPercentage: 8,
          yearlyIncome: 420000,
          level: 3,
          children: [
            {
              id: '7',
              name: 'Emma Davis',
              designation: 'MD',
              compensationPercentage: 60,
              bonusPercentage: 5,
              yearlyIncome: 180000,
              level: 4,
              children: [
                {
                  id: '11',
                  name: 'Alex Turner',
                  designation: 'SFC',
                  compensationPercentage: 55,
                  bonusPercentage: 3,
                  yearlyIncome: 95000,
                  level: 5,
                  children: [
                    {
                      id: '15',
                      name: 'Ryan Cooper',
                      designation: 'Associate',
                      compensationPercentage: 45,
                      yearlyIncome: 65000,
                      level: 6
                    }
                  ]
                }
              ]
            },
            {
              id: '8',
              name: 'James Wilson',
              designation: 'SFC',
              compensationPercentage: 55,
              bonusPercentage: 3,
              yearlyIncome: 150000,
              level: 4,
              children: [
                {
                  id: '12',
                  name: 'Sophie Miller',
                  designation: 'Associate',
                  compensationPercentage: 45,
                  yearlyIncome: 72000,
                  level: 5
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'Robert Martinez',
      designation: 'CEOMD',
      compensationPercentage: 72,
      bonusPercentage: 12,
      yearlyIncome: 780000,
      level: 2,
      children: [
        {
          id: '5',
          name: 'Lisa Thompson',
          designation: 'RMD',
          compensationPercentage: 65,
          bonusPercentage: 8,
          yearlyIncome: 380000,
          level: 3,
          children: [
            {
              id: '9',
              name: 'David Brown',
              designation: 'SEFC',
              compensationPercentage: 50,
              bonusPercentage: 3,
              yearlyIncome: 120000,
              level: 4,
              children: [
                {
                  id: '13',
                  name: 'Emily White',
                  designation: 'Associate',
                  compensationPercentage: 45,
                  yearlyIncome: 68000,
                  level: 5
                }
              ]
            }
          ]
        },
        {
          id: '6',
          name: 'Kevin Anderson',
          designation: 'RMD',
          compensationPercentage: 65,
          bonusPercentage: 8,
          yearlyIncome: 350000,
          level: 3,
          children: [
            {
              id: '10',
              name: 'Patricia Lee',
              designation: 'MD',
              compensationPercentage: 60,
              bonusPercentage: 5,
              yearlyIncome: 165000,
              level: 4,
              children: [
                {
                  id: '14',
                  name: 'Daniel Kim',
                  designation: 'SFC',
                  compensationPercentage: 55,
                  bonusPercentage: 3,
                  yearlyIncome: 92000,
                  level: 5,
                  children: [
                    {
                      id: '16',
                      name: 'Jessica Park',
                      designation: 'Associate',
                      compensationPercentage: 45,
                      yearlyIncome: 63000,
                      level: 6
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

const Associates = () => {
  return (
    <div className="p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Organization Structure</h1>
          <p className="text-gray-500">View your Unilevel MLM organization hierarchy and performance</p>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Unilevel Organization Chart</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-max">
              <UnilevelOrgChart data={mockOrgData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Associates;