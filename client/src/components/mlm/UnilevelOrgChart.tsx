import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Star, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

interface UnilevelOrgChartProps {
  data: OrgMember;
  filterDesignation?: string;
  searchQuery?: string;
  onSelectMember?: (member: OrgMember) => void;
}

const designationColors: Record<string, string> = {
  'CEO': 'bg-purple-100 text-purple-800 border-purple-300',
  'CEOMD': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  'RMD': 'bg-blue-100 text-blue-800 border-blue-300',
  'MD': 'bg-cyan-100 text-cyan-800 border-cyan-300',
  'SFC': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'SEFC': 'bg-teal-100 text-teal-800 border-teal-300',
  'Associate': 'bg-gray-100 text-gray-800 border-gray-300'
};

const getDesignationColor = (designation: string) => {
  const colorClass = designationColors[designation] || 'bg-gray-100 text-gray-800 border-gray-300';
  return { colorClass };
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to find a member and their path to root
const findMemberAndPath = (
  data: OrgMember,
  searchQuery: string,
  path: OrgMember[] = []
): { member: OrgMember | null; path: OrgMember[] } => {
  // Add current node to path
  const currentPath = [...path, data];

  // Check if current node matches search
  if (data.name.toLowerCase().includes(searchQuery.toLowerCase())) {
    return { member: data, path: currentPath };
  }

  // Search children
  if (data.children) {
    for (const child of data.children) {
      const result = findMemberAndPath(child, searchQuery, currentPath);
      if (result.member) {
        return result;
      }
    }
  }

  return { member: null, path: [] };
};

// Helper function to create a filtered tree that includes both upline and downline
const createFilteredTree = (
  path: OrgMember[],
  targetMember: OrgMember,
  filterDesignation: string
): OrgMember | null => {
  if (path.length === 0) return null;

  // Start with the root node
  let currentNode = { ...path[0] };
  let current = currentNode;

  // Reconstruct the path to the target member
  for (let i = 1; i < path.length; i++) {
    const nextNode = { ...path[i] };
    // Only include children that match designation filter or are in the path
    if (path[i].children) {
      nextNode.children = path[i].children.filter(child =>
        filterDesignation === 'All' ||
        child.designation === filterDesignation ||
        path.some(p => p.id === child.id)
      );
    }
    current.children = [nextNode];
    current = nextNode;
  }

  return currentNode;
};

const filterOrgData = (
  data: OrgMember,
  filterDesignation: string,
  searchQuery: string
): OrgMember | null => {
  // If there's a search query, find the member and their path
  if (searchQuery) {
    const { member, path } = findMemberAndPath(data, searchQuery);
    if (member) {
      return createFilteredTree(path, member, filterDesignation);
    }
    return null;
  }

  // If only filtering by designation
  const matchesDesignation = filterDesignation === 'All' || data.designation === filterDesignation;

  if (!matchesDesignation) {
    // If this node doesn't match designation but has children, check children
    if (data.children) {
      const filteredChildren = data.children
        .map(child => filterOrgData(child, filterDesignation, searchQuery))
        .filter((child): child is OrgMember => child !== null);

      if (filteredChildren.length > 0) {
        return {
          ...data,
          children: filteredChildren
        };
      }
    }
    return null;
  }

  // Include this node and filter its children
  return {
    ...data,
    children: data.children
      ?.map(child => filterOrgData(child, filterDesignation, searchQuery))
      .filter((child): child is OrgMember => child !== null)
  };
};

const MemberNode: React.FC<{
  member: OrgMember;
  filterDesignation?: string;
  onSelectMember?: (member: OrgMember) => void;
  isExpanded?: boolean;
  onToggle?: () => void;
}> = ({
  member,
  filterDesignation,
  onSelectMember,
  isExpanded = true,
  onToggle
}) => {
  const hasChildren = member.children && member.children.length > 0;
  const shouldShow = !filterDesignation || filterDesignation === 'All' || member.designation === filterDesignation;
  const { colorClass } = getDesignationColor(member.designation);

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Card
          className={cn(
            "w-72 hover:shadow-lg transition-shadow duration-200 border-2",
            onSelectMember && "hover:ring-2 hover:ring-blue-500",
            colorClass.split(' ')[0].replace('bg-', 'border-')
          )}
          onClick={() => onSelectMember?.(member)}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasChildren && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggle?.();
                      }}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                </div>
                <Badge className={colorClass}>
                  {member.designation}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1 bg-blue-50 p-2 rounded-lg">
                  <TrendingUp size={16} className="text-blue-500" />
                  <span className="font-medium">{member.compensationPercentage}% Comp</span>
                </div>
                {member.bonusPercentage && (
                  <div className="flex items-center gap-1 bg-amber-50 p-2 rounded-lg">
                    <Star size={16} className="text-amber-500" />
                    <span className="font-medium">{member.bonusPercentage}% Bonus</span>
                  </div>
                )}
                <div className="col-span-2 flex items-center gap-1 bg-green-50 p-2 rounded-lg">
                  <Users size={16} className="text-green-500" />
                  <span className="font-medium">{formatCurrency(member.yearlyIncome)}/year</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {hasChildren && isExpanded && (
        <div className="relative mt-8">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-0.5 h-8 bg-gray-300 shadow-sm"></div>
          <div className="relative flex gap-12 pt-8">
            {member.children?.map((child, index, array) => (
              <div key={child.id} className="relative">
                {array.length > 1 && (
                  <>
                    <div
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 h-0.5 bg-gray-300 shadow-sm"
                      style={{
                        width: index === 0 ? '50%' : index === array.length - 1 ? '50%' : '100%',
                        left: index === 0 ? '50%' : index === array.length - 1 ? '0' : '50%'
                      }}
                    />
                    {index === 0 && (
                      <div className="absolute top-0 right-0 w-full h-0.5 bg-gray-300 shadow-sm" />
                    )}
                    {index === array.length - 1 && (
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-300 shadow-sm" />
                    )}
                  </>
                )}
                <MemberNode
                  member={child}
                  filterDesignation={filterDesignation}
                  onSelectMember={onSelectMember}
                  isExpanded={isExpanded}
                  onToggle={onToggle}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const UnilevelOrgChart: React.FC<UnilevelOrgChartProps> = ({
  data,
  filterDesignation = 'All',
  searchQuery = '',
  onSelectMember
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const filteredData = filterOrgData(data, filterDesignation, searchQuery);

  if (!filteredData) {
    return (
      <div className="p-8 text-center text-gray-500">
        No members found matching the current filters
      </div>
    );
  }

  return (
    <div className="p-8 overflow-x-auto min-w-max">
      <MemberNode
        member={filteredData}
        filterDesignation={filterDesignation}
        onSelectMember={onSelectMember}
        isExpanded={expandedNodes[filteredData.id] !== false}
        onToggle={() => toggleNode(filteredData.id)}
      />
    </div>
  );
};