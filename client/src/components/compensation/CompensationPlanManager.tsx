import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Activity, DollarSign } from 'lucide-react';

// Mock data for development
const mockCompensationPlans = [
  {
    id: 1,
    name: "Standard Plan 2025",
    description: "Base compensation plan for all agents",
    isActive: true,
    effectiveDate: "2025-01-01",
    tiers: [
      {
        level: 1,
        personalSalesRequirement: 50000,
        teamSalesRequirement: 0,
        baseCommissionRate: 35,
        overrideRate: 0,
      },
      {
        level: 2,
        personalSalesRequirement: 75000,
        teamSalesRequirement: 150000,
        baseCommissionRate: 40,
        overrideRate: 5,
      },
      {
        level: 3,
        personalSalesRequirement: 100000,
        teamSalesRequirement: 500000,
        baseCommissionRate: 45,
        overrideRate: 10,
      }
    ],
    productRates: [
      {
        productType: "IUL",
        commissionRate: 85,
        minimumPremium: 1000,
        bonusThreshold: 100000
      },
      {
        productType: "Term Life",
        commissionRate: 65,
        minimumPremium: 500,
        bonusThreshold: 75000
      },
      {
        productType: "Annuity",
        commissionRate: 45,
        minimumPremium: 25000,
        bonusThreshold: 250000
      }
    ]
  }
];

export const CompensationPlanManager = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const { toast } = useToast();

  // In a real app, these would be API calls
  const { data: plans = mockCompensationPlans } = useQuery({
    queryKey: ['/api/compensation-plans'],
    retry: 1,
  });

  const addPlan = useMutation({
    mutationFn: async (planData) => {
      // Mock API call
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 1000);
      });
    },
    onSuccess: () => {
      setIsAddingPlan(false);
      toast({
        title: "Plan Added",
        description: "The compensation plan has been successfully created.",
      });
    },
  });

  const handleAddPlan = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    addPlan.mutate({
      name: formData.get('name'),
      description: formData.get('description'),
      effectiveDate: formData.get('effectiveDate'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Compensation Plans</h2>
        <Dialog open={isAddingPlan} onOpenChange={setIsAddingPlan}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Compensation Plan</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddPlan} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="effectiveDate">Effective Date</Label>
                <Input
                  id="effectiveDate"
                  name="effectiveDate"
                  type="date"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Create Plan
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="flex items-center gap-2">
                {plan.isActive && (
                  <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                    Active
                  </span>
                )}
                <Button variant="ghost" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Commission Tiers</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Level</TableHead>
                        <TableHead>Personal Req.</TableHead>
                        <TableHead>Team Req.</TableHead>
                        <TableHead>Base Rate</TableHead>
                        <TableHead>Override</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plan.tiers.map((tier) => (
                        <TableRow key={tier.level}>
                          <TableCell>{tier.level}</TableCell>
                          <TableCell>${tier.personalSalesRequirement.toLocaleString()}</TableCell>
                          <TableCell>${tier.teamSalesRequirement.toLocaleString()}</TableCell>
                          <TableCell>{tier.baseCommissionRate}%</TableCell>
                          <TableCell>{tier.overrideRate}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Product Commission Rates</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Commission Rate</TableHead>
                        <TableHead>Min. Premium</TableHead>
                        <TableHead>Bonus Threshold</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plan.productRates.map((rate) => (
                        <TableRow key={rate.productType}>
                          <TableCell>{rate.productType}</TableCell>
                          <TableCell>{rate.commissionRate}%</TableCell>
                          <TableCell>${rate.minimumPremium.toLocaleString()}</TableCell>
                          <TableCell>${rate.bonusThreshold.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
