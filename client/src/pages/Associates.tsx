import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UnilevelOrgChart } from '@/components/mlm/UnilevelOrgChart';
import { OrgActions } from '@/components/mlm/OrgActions';
import { useToast } from '@/hooks/use-toast';
import { mockOrgData } from '@/lib/mock-data';

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

const Associates = () => {
  const [selectedDesignation, setSelectedDesignation] = useState('All');
  const [selectedMembers, setSelectedMembers] = useState<OrgMember[]>([]);
  const { toast } = useToast();

  const handleMemberSelect = (member: OrgMember) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m.id === member.id);
      if (isSelected) {
        return prev.filter(m => m.id !== member.id);
      }
      return [...prev, member];
    });
  };

  const handleEmailClick = () => {
    if (selectedMembers.length === 0) {
      toast({
        title: "No members selected",
        description: "Please select one or more team members to send an email.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Email action triggered",
      description: `Preparing to send email to ${selectedMembers.length} team members.`
    });
    // Implement email functionality
  };

  const handleScheduleClick = () => {
    if (selectedMembers.length === 0) {
      toast({
        title: "No members selected",
        description: "Please select one or more team members to schedule a meeting.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Schedule meeting",
      description: `Preparing to schedule meeting with ${selectedMembers.length} team members.`
    });
    // Implement meeting scheduling functionality
  };

  const handleCollapseAll = () => {
    // Implement collapse all functionality
    toast({
      title: "Collapsed all nodes",
      description: "All organization nodes have been collapsed."
    });
  };

  const handleExpandAll = () => {
    // Implement expand all functionality
    toast({
      title: "Expanded all nodes",
      description: "All organization nodes have been expanded."
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Organization Structure</h1>
            <p className="text-gray-500">View your Unilevel MLM organization hierarchy and performance</p>
          </div>
          {selectedMembers.length > 0 && (
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-blue-700 font-medium">
                {selectedMembers.length} member{selectedMembers.length > 1 ? 's' : ''} selected
              </span>
            </div>
          )}
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Unilevel Organization Chart</CardTitle>
            <OrgActions
              selectedDesignation={selectedDesignation}
              onDesignationChange={setSelectedDesignation}
              onEmailClick={handleEmailClick}
              onScheduleClick={handleScheduleClick}
              onCollapseAll={handleCollapseAll}
              onExpandAll={handleExpandAll}
            />
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-max">
              <UnilevelOrgChart
                data={mockOrgData}
                filterDesignation={selectedDesignation}
                onSelectMember={handleMemberSelect}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Associates;