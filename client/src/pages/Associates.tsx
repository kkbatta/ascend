import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UnilevelOrgChart } from '@/components/mlm/UnilevelOrgChart';
import { OrgActions } from '@/components/mlm/OrgActions';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<OrgMember[]>([]);
  const { toast } = useToast();

  // Fetch organization hierarchy data
  const { data: orgData, isLoading, error } = useQuery({
    queryKey: ['/api/org-hierarchy'],
    queryFn: async () => {
      const response = await fetch('/api/org-hierarchy');
      if (!response.ok) {
        throw new Error('Failed to fetch organization data');
      }
      const data = await response.json();
      // Return the first item since the API returns an array but we need a single root node
      return data[0];
    }
  });

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
  };

  const handleCollapseAll = () => {
    toast({
      title: "Collapsed all nodes",
      description: "All organization nodes have been collapsed."
    });
  };

  const handleExpandAll = () => {
    toast({
      title: "Expanded all nodes",
      description: "All organization nodes have been expanded."
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading organization data. Please try again later.
      </div>
    );
  }

  if (!orgData) {
    return (
      <div className="p-6 text-center text-gray-500">
        No organization data available.
      </div>
    );
  }

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
              searchQuery={searchQuery}
              onDesignationChange={setSelectedDesignation}
              onSearchChange={setSearchQuery}
              onEmailClick={handleEmailClick}
              onScheduleClick={handleScheduleClick}
              onCollapseAll={handleCollapseAll}
              onExpandAll={handleExpandAll}
            />
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-max">
              <UnilevelOrgChart
                data={orgData}
                filterDesignation={selectedDesignation}
                searchQuery={searchQuery}
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