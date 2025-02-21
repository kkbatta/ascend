import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users, Search, DollarSign, BarChart3, LinkIcon,
  ChevronRight, ChevronDown
} from 'lucide-react';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { hierarchyMetrics, hierarchyData, currentUser } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

const TreeNode = ({ item, view, level = 0 }: { item: any; view: 'recruiting' | 'production'; level: number }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="relative">
      <div className={`flex items-center ${level > 0 ? 'ml-8 mt-2' : ''}`}>
        {level > 0 && (
          <div className="absolute left-0 top-1/2 w-6 h-px bg-gray-300" />
        )}
        <div className="flex-1 flex items-center p-2 rounded-lg hover:bg-gray-50">
          {hasChildren && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mr-2 text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          <Avatar className="w-8 h-8 ring-1 ring-offset-1 ring-blue-500">
            <img src={item.avatarUrl} alt={item.name} />
          </Avatar>
          <div className="ml-3 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate">{item.name}</span>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                {item.rank}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{item.location}</span>
              {view === 'recruiting' ? (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {item.rv} RV ({item.recruits} recruits)
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  ${item.production.toLocaleString()} ({item.teamSize} team)
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div className="relative">
          {item.children.map((child: any, index: number) => (
            <div key={child.id} className="relative">
              {index > 0 && <div className="absolute left-7 top-0 w-px h-full bg-gray-300" />}
              <TreeNode item={child} view={view} level={level + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [view, setView] = useState('recruiting');
  const { toast } = useToast();

  const isHierarchyTab = activeTab !== 'performance';
  const currentMetrics = isHierarchyTab ? hierarchyMetrics[activeTab as keyof typeof hierarchyMetrics] : null;

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/register?ref=${currentUser.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Referral link copied!",
      description: "Share this link with your prospects to grow your team.",
    });
  };

  // Transform flat data into hierarchical structure
  const buildHierarchy = (data: any[], parentId: number | null = null): any[] => {
    return data
      .filter(item => item.parentId === parentId)
      .map(item => ({
        ...item,
        children: buildHierarchy(data, item.id)
      }));
  };

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Team Hierarchy</h1>
            <p className="text-gray-500">View and manage your team structure</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-xl w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={copyReferralLink}
            >
              <LinkIcon size={16} />
              <span>Share Referral</span>
            </Button>
          </div>
        </div>

        {isHierarchyTab && currentMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <MetricsCard
              title="Total Team Size"
              value={currentMetrics.teamSize.toLocaleString()}
              icon={<Users className="w-6 h-6 text-blue-500" />}
              trend={12}
            />
            <MetricsCard
              title="Monthly Revenue"
              value={`$${currentMetrics.monthlyRevenue.toLocaleString()}`}
              icon={<DollarSign className="w-6 h-6 text-green-500" />}
              trend={8}
            />
            <MetricsCard
              title="New Recruits"
              value={currentMetrics.newRecruits.toLocaleString()}
              icon={<Users className="w-6 h-6 text-purple-500" />}
              trend={15}
            />
            <MetricsCard
              title="Team Production"
              value={`$${currentMetrics.teamProduction.toLocaleString()}`}
              icon={<BarChart3 className="w-6 h-6 text-orange-500" />}
              trend={10}
            />
          </div>
        )}

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg mb-1">Organization Structure</CardTitle>
                <p className="text-gray-500 text-sm">Hierarchical view of your team</p>
              </div>
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
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="baseShop">Base Shop</TabsTrigger>
                <TabsTrigger value="rmdBase">RMD Base Shop</TabsTrigger>
                <TabsTrigger value="superBase">RMD Super Base</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <div className="overflow-x-auto">
                  {hierarchyData[activeTab as keyof typeof hierarchyData].map((item) => (
                    <TreeNode
                      key={item.id}
                      item={item}
                      view={view as 'recruiting' | 'production'}
                      level={0}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;