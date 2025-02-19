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
  Percent,
  Settings,
  Plus
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Mock data for development - This section is largely from the edited snippet.
const mockTemplates = [
  {
    id: 1,
    name: "Standard Hierarchy Template",
    rules: [
      {
        agentLevel: "Associate",
        baseCommissionRate: 55,
        personalProductionRequirement: 25000,
        teamProductionRequirement: 0,
        overrideRate: 0
      },
      {
        agentLevel: "MD",
        baseCommissionRate: 65,
        personalProductionRequirement: 50000,
        teamProductionRequirement: 150000,
        overrideRate: 10
      },
      {
        agentLevel: "RMD",
        baseCommissionRate: 70,
        personalProductionRequirement: 75000,
        teamProductionRequirement: 500000,
        overrideRate: 15
      }
    ],
    bonuses: [
      {
        name: "Monthly Production Bonus",
        threshold: 100000,
        bonusType: "percentage",
        bonusValue: 5,
        isPeriodic: true,
        periodType: "monthly"
      },
      {
        name: "Team Growth Bonus",
        threshold: 1000000,
        bonusType: "flat",
        bonusValue: 10000,
        isPeriodic: true,
        periodType: "quarterly"
      }
    ]
  }
];

export const CommissionCalculator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(mockTemplates[0]);
  const [agentLevel, setAgentLevel] = useState('');
  const [personalProduction, setPersonalProduction] = useState('');
  const [teamProduction, setTeamProduction] = useState('');
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const { toast } = useToast();

  // In a real app, this would be an API call
  const { data: commissionData = mockTemplates } = useQuery({
    queryKey: ['/api/commission-templates'],
    retry: 1,
  });

  const calculateCommission = () => {
    if (!selectedTemplate || !agentLevel || !personalProduction) return null;

    const rule = selectedTemplate.rules.find(r => r.agentLevel === agentLevel);
    if (!rule) return null;

    const personal = parseFloat(personalProduction);
    const team = parseFloat(teamProduction) || 0;

    // Calculate base commission
    let totalCommission = (personal * (rule.baseCommissionRate / 100));

    // Calculate overrides if applicable
    if (rule.overrideRate > 0 && team > 0) {
      totalCommission += (team * (rule.overrideRate / 100));
    }

    // Calculate bonuses
    selectedTemplate.bonuses.forEach(bonus => {
      const productionToCheck = bonus.name.toLowerCase().includes('team') 
        ? team 
        : personal;

      if (productionToCheck >= bonus.threshold) {
        if (bonus.bonusType === 'percentage') {
          totalCommission += (productionToCheck * (bonus.bonusValue / 100));
        } else {
          totalCommission += bonus.bonusValue;
        }
      }
    });

    return totalCommission.toFixed(2);
  };

  const handleTemplateChange = (templateId: string) => {
    const template = commissionData.find(t => t.id.toString() === templateId);
    if (template) {
      setSelectedTemplate(template);
      setAgentLevel('');
      setPersonalProduction('');
      setTeamProduction('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Commission Calculator</h2>
        <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Manage Templates
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w 2xl">
            <DialogHeader>
              <DialogTitle>Commission Templates</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Active Templates</CardTitle>
                    <Button size="sm" className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Template
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Template Name</TableHead>
                        <TableHead>Agent Levels</TableHead>
                        <TableHead>Bonus Rules</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commissionData.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell className="font-medium">
                            {template.name}
                          </TableCell>
                          <TableCell>
                            {template.rules.map(r => r.agentLevel).join(', ')}
                          </TableCell>
                          <TableCell>{template.bonuses.length} rules</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Commission Template</Label>
                <Select 
                  value={selectedTemplate?.id.toString()} 
                  onValueChange={handleTemplateChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {commissionData.map((template) => (
                      <SelectItem 
                        key={template.id} 
                        value={template.id.toString()}
                      >
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Agent Level</Label>
                <Select value={agentLevel} onValueChange={setAgentLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTemplate?.rules.map((rule) => (
                      <SelectItem 
                        key={rule.agentLevel} 
                        value={rule.agentLevel}
                      >
                        {rule.agentLevel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Personal Production</Label>
                <Input
                  type="number"
                  value={personalProduction}
                  onChange={(e) => setPersonalProduction(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              <div className="space-y-2">
                <Label>Team Production</Label>
                <Input
                  type="number"
                  value={teamProduction}
                  onChange={(e) => setTeamProduction(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
            </div>

            <div className="space-y-4">
              {agentLevel && selectedTemplate && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Selected Level Details</h3>
                  {selectedTemplate.rules
                    .filter(r => r.agentLevel === agentLevel)
                    .map((rule) => (
                      <div key={rule.agentLevel} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Base Commission Rate:</span>
                          <span className="font-medium">{rule.baseCommissionRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Personal Requirement:</span>
                          <span className="font-medium">
                            ${rule.personalProductionRequirement.toLocaleString()}
                          </span>
                        </div>
                        {rule.teamProductionRequirement > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Team Requirement:</span>
                            <span className="font-medium">
                              ${rule.teamProductionRequirement.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {rule.overrideRate > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Override Rate:</span>
                            <span className="font-medium">{rule.overrideRate}%</span>
                          </div>
                        )}
                      </div>
                    ))}

                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Available Bonuses</h3>
                    <div className="space-y-2">
                      {selectedTemplate.bonuses.map((bonus) => (
                        <div key={bonus.name} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{bonus.name}</p>
                              <p className="text-sm text-gray-500">
                                Threshold: ${bonus.threshold.toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {bonus.bonusType === 'percentage' 
                                  ? `${bonus.bonusValue}%` 
                                  : `$${bonus.bonusValue.toLocaleString()}`}
                              </p>
                              <p className="text-sm text-gray-500">
                                {bonus.isPeriodic ? `${bonus.periodType}` : 'one-time'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Estimated Commission:</span>
                    <span className="text-2xl font-bold">
                      ${agentLevel && personalProduction 
                          ? calculateCommission() 
                          : '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/*Original code's Recent Transactions section remains here.  The above replaces the calculator section.*/}
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