import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  Search,
  DollarSign,
  BarChart3,
  Link as LinkIcon
} from 'lucide-react';

import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { Badge } from '@/components/ui/badge'; // Assuming Badge component exists
import { hierarchyMetrics, hierarchyData, currentUser, teamMemberStats, achievements } from '@/lib/mock-data';
import { GamifiedLeaderboard } from '@/components/dashboard/GamifiedLeaderboard';

const LeaderboardItem = ({ item, view }: { item: any, view: 'recruiting' | 'production' }) => (
  <div className="bg-white rounded-lg border border-gray-100 p-3 hover:shadow-sm transition-all duration-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="w-8 h-8 ring-1 ring-offset-1 ring-blue-500">
          <img src={item.avatarUrl} alt={item.name} />
        </Avatar>
        <div>
          <div className="flex items-center gap-1">
            <p className="font-medium text-sm">{item.name}</p>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs px-1.5">
              {item.rank}
            </Badge>
          </div>
          <p className="text-xs text-gray-500">{item.location}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        {view === 'recruiting' ? (
          <>
            <Badge variant="success" className="bg-green-500 text-white text-xs px-2">
              {item.rv} RV
            </Badge>
            <span className="text-xs text-gray-600">
              {item.recruits} Recruits
            </span>
          </>
        ) : (
          <>
            <Badge variant="success" className="bg-blue-500 text-white text-xs px-2">
              ${item.production.toLocaleString()}
            </Badge>
            <span className="text-xs text-gray-600">
              Team: {item.teamSize}
            </span>
          </>
        )}
      </div>
    </div>
  </div>
);

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

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-500">Welcome back to your MLM performance overview</p>
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
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
                <Avatar className="w-8 h-8">
                  <img src={currentUser.avatarUrl} alt={currentUser.name} />
                </Avatar>
                <span>Hello {currentUser.name}!</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 ml-2"
                onClick={copyReferralLink}
              >
                <LinkIcon size={16} />
                <span>Share Referral</span>
              </Button>
            </div>
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
                <CardTitle className="text-lg mb-1">HGI Builder Leaderboard</CardTitle>
                <p className="text-gray-500 text-sm">Track your team's performance and rankings</p>
              </div>
              {isHierarchyTab && (
                <div className="flex gap-2">
                  <Button
                    variant={view === 'recruiting' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setView('recruiting')}
                  >
                    Recruiting
                  </Button>
                  <Button
                    variant={view === 'production' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setView('production')}
                  >
                    Production
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="baseShop">Base Shop</TabsTrigger>
                <TabsTrigger value="rmdBase">RMD Base Shop</TabsTrigger>
                <TabsTrigger value="superBase">RMD Super Base</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              {isHierarchyTab ? (
                <TabsContent value={activeTab}>
                  <div className="grid gap-2">
                    {hierarchyData[activeTab as keyof typeof hierarchyData].map((item) => (
                      <LeaderboardItem key={item.id} item={item} view={view as 'recruiting' | 'production'} />
                    ))}
                  </div>
                </TabsContent>
              ) : (
                <TabsContent value="performance">
                  <GamifiedLeaderboard
                    teamMember={teamMemberStats[1]}
                    achievements={achievements}
                  />
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;