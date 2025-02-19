import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Calculator,
  Percent
} from 'lucide-react';

// Mock data for development
const mockCommissionData = {
  currentMonth: {
    earned: 15750,
    pending: 8500,
    projected: 22000,
    breakdown: [
      {
        type: 'Personal Sales',
        amount: 12000,
        status: 'Earned',
        date: '2025-02-15'
      },
      {
        type: 'Team Override',
        amount: 3750,
        status: 'Earned',
        date: '2025-02-15'
      },
      {
        type: 'Personal Sales',
        amount: 5500,
        status: 'Pending',
        date: '2025-02-18'
      },
      {
        type: 'Team Override',
        amount: 3000,
        status: 'Pending',
        date: '2025-02-20'
      }
    ]
  },
  recentTransactions: [
    {
      id: 1,
      date: '2025-02-15',
      type: 'IUL Sale',
      premium: 100000,
      commission: 8500,
      status: 'Paid'
    },
    {
      id: 2,
      date: '2025-02-14',
      type: 'Term Life',
      premium: 75000,
      commission: 4875,
      status: 'Pending'
    },
    {
      id: 3,
      date: '2025-02-13',
      type: 'Annuity',
      premium: 250000,
      commission: 11250,
      status: 'Processing'
    }
  ]
};

export const CommissionCalculator = () => {
  const [productType, setProductType] = useState('');
  const [premium, setPremium] = useState('');
  
  // In a real app, this would be an API call
  const { data: commissionData = mockCommissionData } = useQuery({
    queryKey: ['/api/commissions/current'],
    retry: 1,
  });

  const calculateCommission = () => {
    // This would be an API call in production
    const premiumAmount = parseFloat(premium);
    let rate = 0;
    switch (productType) {
      case 'IUL':
        rate = 0.085;
        break;
      case 'Term':
        rate = 0.065;
        break;
      case 'Annuity':
        rate = 0.045;
        break;
    }
    return (premiumAmount * rate).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Earned This Month</p>
                <p className="text-2xl font-bold">${commissionData.currentMonth.earned.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Pending Commission</p>
                <p className="text-2xl font-bold">${commissionData.currentMonth.pending.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <Calculator className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Projected Total</p>
                <p className="text-2xl font-bold">${commissionData.currentMonth.projected.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Percent className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commission Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="productType">Product Type</Label>
              <Select value={productType} onValueChange={setProductType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IUL">Indexed Universal Life</SelectItem>
                  <SelectItem value="Term">Term Life</SelectItem>
                  <SelectItem value="Annuity">Annuity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="premium">Premium Amount</Label>
              <Input
                id="premium"
                type="number"
                value={premium}
                onChange={(e) => setPremium(e.target.value)}
                placeholder="Enter premium amount"
              />
            </div>
            <div className="space-y-2">
              <Label>Estimated Commission</Label>
              <div className="h-10 px-3 py-2 rounded-md border bg-gray-50 flex items-center">
                <span className="font-medium">
                  ${productType && premium ? calculateCommission() : '0.00'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissionData.recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>${transaction.premium.toLocaleString()}</TableCell>
                  <TableCell>${transaction.commission.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      transaction.status === 'Paid' 
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
