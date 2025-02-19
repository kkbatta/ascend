import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BusinessValueChart } from "@/components/dashboard/BusinessValueChart";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import {
  DollarSign,
  Users,
  CreditCard,
  Building2,
  Plus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const Business = () => {
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const { toast } = useToast();

  // Fetch business performance data
  const { data: businessMetrics } = useQuery({
    queryKey: ['/api/business/metrics'],
    retry: 1,
  });

  // Fetch ACH accounts
  const { data: achAccounts } = useQuery({
    queryKey: ['/api/ach/accounts'],
    retry: 1,
  });

  // Add ACH account mutation
  const addAchAccount = useMutation({
    mutationFn: async (accountData) => {
      const response = await fetch('/api/ach/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData),
      });
      if (!response.ok) throw new Error('Failed to add account');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ach/accounts'] });
      setIsAddingAccount(false);
      toast({
        title: "Account Added",
        description: "Your bank account has been successfully linked.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add bank account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddAccount = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    addAchAccount.mutate({
      bankName: formData.get('bankName'),
      accountType: formData.get('accountType'),
      routingNumber: formData.get('routingNumber'),
      accountNumber: formData.get('accountNumber'),
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Business Management</h1>
        <Dialog open={isAddingAccount} onOpenChange={setIsAddingAccount}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Link Bank Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Link Bank Account for Compensation</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" name="bankName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type</Label>
                <Select name="accountType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input
                  id="routingNumber"
                  name="routingNumber"
                  required
                  pattern="[0-9]{9}"
                  maxLength={9}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  required
                  type="password"
                  pattern="[0-9]{4,17}"
                />
              </div>
              <Button type="submit" className="w-full">
                Link Account
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Personal Production</p>
                <p className="text-2xl font-bold">${businessMetrics?.personalProduction.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Team Production</p>
                <p className="text-2xl font-bold">${businessMetrics?.teamProduction.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Commission Rate</p>
                <p className="text-2xl font-bold">{businessMetrics?.commissionRate}%</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Building2 className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Next Payout</p>
                <p className="text-2xl font-bold">${businessMetrics?.nextPayout.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <CreditCard className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Business Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <BusinessValueChart data={businessMetrics?.performanceData || []} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Linked Bank Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achAccounts?.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-full">
                        <Building2 className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{account.bankName}</p>
                        <p className="text-sm text-gray-500">
                          {account.accountType} ****{account.accountNumber.slice(-4)}
                        </p>
                      </div>
                    </div>
                    {account.isVerified ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                ))}
                {(!achAccounts || achAccounts.length === 0) && (
                  <div className="text-center p-4 text-gray-500">
                    No bank accounts linked yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Business;