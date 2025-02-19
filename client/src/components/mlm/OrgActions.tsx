import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Calendar, ChevronDown, ChevronRight, Filter } from 'lucide-react';

interface OrgActionsProps {
  selectedDesignation: string;
  onDesignationChange: (value: string) => void;
  onEmailClick: () => void;
  onScheduleClick: () => void;
  onCollapseAll: () => void;
  onExpandAll: () => void;
}

export const OrgActions: React.FC<OrgActionsProps> = ({
  selectedDesignation,
  onDesignationChange,
  onEmailClick,
  onScheduleClick,
  onCollapseAll,
  onExpandAll,
}) => {
  const designations = [
    'All',
    'CEO',
    'CEOMD',
    'RMD',
    'MD',
    'SFC',
    'SEFC',
    'Associate'
  ];

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <Select value={selectedDesignation} onValueChange={onDesignationChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by designation" />
          </SelectTrigger>
          <SelectContent>
            {designations.map(designation => (
              <SelectItem key={designation} value={designation}>
                {designation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCollapseAll}
          className="flex items-center gap-1"
        >
          <ChevronDown className="w-4 h-4" />
          Collapse All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExpandAll}
          className="flex items-center gap-1"
        >
          <ChevronRight className="w-4 h-4" />
          Expand All
        </Button>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="outline"
          onClick={onEmailClick}
          className="flex items-center gap-2"
        >
          <Mail className="w-4 h-4" />
          Send Email
        </Button>
        <Button
          variant="outline"
          onClick={onScheduleClick}
          className="flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Schedule Meeting
        </Button>
      </div>
    </div>
  );
};
