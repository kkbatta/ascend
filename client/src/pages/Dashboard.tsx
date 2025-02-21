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
      <div className="ml-6 py-1">
        {/* Vertical connection line to parent */}
        {level > 0 && (
          <div className="absolute left-[-12px] top-0 h-full w-[1px] bg-gray-200" />
        )}
        {/* Horizontal connection line */}
        {level > 0 && (
          <div className="absolute left-[-12px] top-[50%] w-3 h-[1px] bg-gray-200" />
        )}

        {/* Node content */}
        <div className="flex items-center bg-white rounded-lg border border-gray-100 p-2 hover:shadow-sm transition-all duration-200">
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="mr-2 p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}

          <Avatar className="w-6 h-6 mr-2">
            <img src={item.avatarUrl} alt={item.name} />
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate">{item.name}</span>
              <Badge variant="secondary" className="text-xs px-1">
                {item.rank}
              </Badge>
            </div>
            <div className="flex items-center text-xs text-gray-500 mt-0.5">
              <span className="truncate">{item.location}</span>
              {view === 'recruiting' ? (
                <Badge variant="outline" className="ml-2 text-xs">
                  {item.rv} RV • {item.recruits} recruits
                </Badge>
              ) : (
                <Badge variant="outline" className="ml-2 text-xs">
                  ${item.production.toLocaleString()} • {item.teamSize} team
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-6">
          {item.children.map((child: any, index: number) => (
            <TreeNode
              key={child.id}
              item={child}
              view={view}
              level={level + 1}
            />
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

  const copyReferralLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/register?ref=${currentUser.id}`);
    toast({
      title: "Referral link copied!",
      description: "Share this link with your prospects to grow your team.",
    });
  };

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Team Hierarchy</h1>
            <p className="text-gray-500">View and manage your team structure</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search members..."
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyReferralLink}
              className="flex items-center gap-2"
            >
              <LinkIcon size={16} />
              <span>Share Referral</span>
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Organization Structure</CardTitle>
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