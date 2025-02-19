import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Mail, Calendar, ChevronDown, ChevronRight, Filter, Search } from 'lucide-react';

interface OrgActionsProps {
  selectedDesignation: string;
  searchQuery: string;
  onDesignationChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onEmailClick: () => void;
  onScheduleClick: () => void;
  onCollapseAll: () => void;
  onExpandAll: () => void;
}

export const OrgActions: React.FC<OrgActionsProps> = ({
  selectedDesignation,
  searchQuery,
  onDesignationChange,
  onSearchChange,
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
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2 min-w-[280px]">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select value={selectedDesignation} onValueChange={onDesignationChange}>
            <SelectTrigger>
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

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
        </div>
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

      <div className="flex items-center gap-2">
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