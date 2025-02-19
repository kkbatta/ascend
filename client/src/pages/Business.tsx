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
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Briefcase,
  Award,
  Target,
} from "lucide-react";

// Mock data
const mockBusinessMetrics = {
  personalProduction: 125000,
  teamProduction: 450000,
  commissionRate: 35,
  nextPayout: 15750,
  performanceData: [
    { month: 'Jan', personal: 95000, team: 380000, target: 400000 },
    { month: 'Feb', personal: 105000, team: 420000, target: 420000 },
    { month: 'Mar', personal: 125000, team: 450000, target: 450000 },
  ],
  productMix: [
    { name: 'IUL', personal: 45000, team: 180000 },
    { name: 'Term Life', personal: 35000, team: 120000 },
    { name: 'Annuities', personal: 45000, team: 150000 },
  ],
  teamMembers: [
    {
      id: 1,
      name: 'Alice Johnson',
      role: 'Senior Agent',
      production: 85000,
      growth: 12,
      products: { IUL: 35000, Term: 25000, Annuities: 25000 }
    },
    {
      id: 2,
      name: 'Bob Smith',
      role: 'Agent',
      production: 65000,
      growth: 8,
      products: { IUL: 30000, Term: 20000, Annuities: 15000 }
    },
    {
      id: 3,
      name: 'Carol White',
      role: 'Junior Agent',
      production: 45000,
      growth: 15,
      products: { IUL: 20000, Term: 15000, Annuities: 10000 }
    }
  ]
};

const mockAchAccounts = [
  {
    id: 1,
    bankName: 'Chase Bank',
    accountType: 'checking',
    accountNumber: '****4567',
    isVerified: true,
  },
  {
    id: 2,
    bankName: 'Wells Fargo',
    accountType: 'savings',
    accountNumber: '****8901',
    isVerified: false,
  }
];

const Business = () => {
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [expandedMember, setExpandedMember] = useState<number | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'details' | 'team'>('overview');
  const { toast } = useToast();

  // Use mock data instead of API calls for now
  const businessMetrics = mockBusinessMetrics;
  const achAccounts = mockAchAccounts;

  const addAchAccount = useMutation({
    mutationFn: async (accountData: any) => {
      // Mock API call
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 1000);
      });
    },
    onSuccess: () => {
      setIsAddingAccount(false);
      toast({
        title: "Account Added",
        description: "Your bank account has been successfully linked.",
      });
    },
  });

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
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
        <div>
          <h1 className="text-2xl font-bold">Business Management</h1>
          <p className="text-gray-500">Track your personal and team performance</p>
        </div>
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

      <Tabs value={selectedView} onValueChange={(v: any) => setSelectedView(v)} className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Business Details</TabsTrigger>
          <TabsTrigger value="team">Team Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
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
                  <BusinessValueChart data={businessMetrics.performanceData} />
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
        </TabsContent>

        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Mix Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businessMetrics.productMix.map((product) => (
                    <div key={product.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-sm text-gray-500">
                          Personal: ${product.personal.toLocaleString()} | 
                          Team: ${product.team.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${(product.personal / product.team) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Personal vs Team Contribution</h3>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${(businessMetrics.personalProduction / businessMetrics.teamProduction) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-sm text-gray-500">
                      <span>Personal: ${businessMetrics.personalProduction.toLocaleString()}</span>
                      <span>Team: ${businessMetrics.teamProduction.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Member Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessMetrics.teamMembers.map((member) => (
                  <div key={member.id} className="border rounded-lg p-4">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedMember(
                        expandedMember === member.id ? null : member.id
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Production</p>
                          <p className="font-bold">${member.production.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center text-green-500">
                          <TrendingUp className="w-4 h-4" />
                          <span className="ml-1">{member.growth}%</span>
                        </div>
                        {expandedMember === member.id ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                    {expandedMember === member.id && (
                      <div className="mt-4 pl-14">
                        <div className="grid grid-cols-3 gap-4">
                          {Object.entries(member.products).map(([product, amount]) => (
                            <div key={product} className="p-4 bg-gray-50 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-500">{product}</h4>
                              <p className="text-lg font-bold">${(amount as number).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Business;