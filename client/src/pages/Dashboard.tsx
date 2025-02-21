import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users, Search, DollarSign, BarChart3, LinkIcon,
  ChevronRight, ChevronDown, ArrowUpRight, Filter
} from 'lucide-react';
import { hierarchyMetrics, hierarchyData } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

// Helper function to check if a node or its descendants match the filter
const nodeMatchesFilter = (node: any, titleFilter: string): boolean => {
  if (!titleFilter) return true;
  if (node.rank.toLowerCase().includes(titleFilter.toLowerCase())) return true;
  if (node.children) {
    return node.children.some((child: any) => nodeMatchesFilter(child, titleFilter));
  }
  return false;
};

// Helper function to get path to root
const getPathToRoot = (node: any, targetId: number, path: any[] = []): any[] | null => {
  if (node.id === targetId) {
    return [...path, node];
  }
  if (node.children) {
    for (const child of node.children) {
      const result = getPathToRoot(child, targetId, [...path, node]);
      if (result) return result;
    }
  }
  return null;
};

const OrgNode = ({
  data,
  view,
  level = 0,
  titleFilter,
  expandedNodes,
  onToggleExpand
}: {
  data: any;
  view: 'recruiting' | 'production';
  level: number;
  titleFilter: string;
  expandedNodes: Set<number>;
  onToggleExpand: (id: number) => void;
}) => {
  const hasChildren = data.children && data.children.length > 0;
  const isExpanded = expandedNodes.has(data.id);
  const shouldShow = !titleFilter || nodeMatchesFilter(data, titleFilter);

  const getBgColor = () => {
    switch (data.rank) {
      case 'NMD': return 'bg-purple-50 border-purple-200';
      case 'SMD': return 'bg-blue-50 border-blue-200';
      case 'RMD': return 'bg-green-50 border-green-200';
      case 'EFC': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (!shouldShow && !hasChildren) return null;

  return (
    <div className="relative">
      <div className={`relative flex flex-col ${level > 0 ? 'ml-12 mt-2' : ''}`}>
        {level > 0 && (
          <>
            <div className="absolute left-[-24px] top-[24px] w-6 h-[1px] bg-gray-300" />
            <div className="absolute left-[-24px] top-0 h-full w-[1px] bg-gray-300" />
          </>
        )}

        <div className={`flex items-center p-2 rounded-lg border ${getBgColor()} hover:shadow-sm transition-all duration-200 max-w-md`}>
          <div className="flex items-center flex-1 min-w-0">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(data.id);
                }}
                className="mr-2 p-1 rounded hover:bg-white/50"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}

            <Avatar className="w-8 h-8 ring-2 ring-offset-2 ring-blue-500">
              <img src={data.avatarUrl} alt={data.name} />
            </Avatar>

            <div className="ml-3 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{data.name}</span>
                <Badge variant="secondary" className={`text-xs ${
                  data.rank === 'NMD' ? 'bg-purple-100 text-purple-700' :
                    data.rank === 'SMD' ? 'bg-blue-100 text-blue-700' :
                      data.rank === 'RMD' ? 'bg-green-100 text-green-700' :
                        data.rank === 'EFC' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                }`}>
                  {data.rank}
                </Badge>
              </div>

              <div className="flex items-center text-xs text-gray-500 mt-1">
                <span className="truncate">{data.location}</span>
                {view === 'recruiting' ? (
                  <div className="ml-auto flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {data.rv} RV
                    </Badge>
                    <span className="text-gray-600">
                      {data.recruits} recruits
                    </span>
                  </div>
                ) : (
                  <div className="ml-auto flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      ${data.production.toLocaleString()}
                    </Badge>
                    <span className="text-gray-600">
                      {data.teamSize} team
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="pl-12 relative">
            {data.children.map((child: any) => (
              <OrgNode
                key={child.id}
                data={child}
                view={view}
                level={level + 1}
                titleFilter={titleFilter}
                expandedNodes={expandedNodes}
                onToggleExpand={onToggleExpand}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [view, setView] = useState('recruiting');
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const currentMetrics = hierarchyMetrics[activeTab];

  const currentUser = {
    name: "John Maxwell",
    role: "National Marketing Director",
    avatar: "/api/placeholder/40/40?text=JM",
    teamSize: 5200,
    monthlyRevenue: 8500000,
    activeProspects: 145
  };

  const toggleExpand = (id: number) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Initialize expanded state for visible nodes
  React.useEffect(() => {
    const initialExpanded = new Set<number>();
    const initializeExpanded = (node: any) => {
      if (node.children) {
        initialExpanded.add(node.id);
        node.children.forEach(initializeExpanded);
      }
    };
    hierarchyData[activeTab].forEach(initializeExpanded);
    setExpandedNodes(initialExpanded);
  }, [activeTab]);


  const copyReferralLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/register?ref=${currentUser.name}`);
    toast({
      title: "Referral link copied!",
      description: "Share this link with your prospects to grow your team.",
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Organization Chart</h1>
            <p className="text-gray-500">View your team's hierarchy and performance</p>
          </div>

          <div className="flex items-center gap-4">
            {/* User Profile Section */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border shadow-sm">
              <Avatar className="h-10 w-10 border-2 border-blue-500">
                <img src={currentUser.avatar} alt={currentUser.name} />
              </Avatar>
              <div>
                <h3 className="font-medium text-sm">{currentUser.name}</h3>
                <p className="text-xs text-gray-500">{currentUser.role}</p>
              </div>
              <div className="border-l pl-3 ml-3">
                <div className="text-xs text-gray-500">Team Size</div>
                <div className="font-medium">{currentUser.teamSize}</div>
              </div>
              <div className="border-l pl-3">
                <div className="text-xs text-gray-500">Monthly Revenue</div>
                <div className="font-medium">${currentUser.monthlyRevenue.toLocaleString()}</div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={copyReferralLink}
              className="flex items-center gap-2"
            >
              <LinkIcon size={16} />
              <span>Share Referral Link</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Team Size</p>
                    <p className="text-xl font-bold">{currentMetrics.teamSize.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-500">
                  <ArrowUpRight size={14} />
                  <span className="text-sm font-medium">12%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-50">
                    <DollarSign className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="text-xl font-bold">${currentMetrics.monthlyRevenue.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-500">
                  <ArrowUpRight size={14} />
                  <span className="text-sm font-medium">8%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle>Team Structure</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={view === 'recruiting' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setView('recruiting')}
                    >
                      Recruiting View
                    </Button>
                    <Button
                      variant={view === 'production' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setView('production')}
                    >
                      Production View
                    </Button>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="baseShop">Base Shop</TabsTrigger>
                    <TabsTrigger value="rmdBase">RMD Base Shop</TabsTrigger>
                    <TabsTrigger value="superBase">RMD Super Base</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="mt-4 space-y-4">
              {hierarchyData[activeTab].map((item: any) => (
                <OrgNode
                  key={item.id}
                  data={item}
                  view={view}
                  level={0}
                  titleFilter={''}
                  expandedNodes={expandedNodes}
                  onToggleExpand={toggleExpand}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;