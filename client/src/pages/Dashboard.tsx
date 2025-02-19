import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { 
  Users, 
  TrendingUp, 
  Search, 
  DollarSign, 
  BarChart3,
  FileText, 
  Target, 
  MessageSquare, 
  HelpCircle, 
  LogOut,
  BookOpen, 
  Settings,
  BarChart2
} from 'lucide-react';
import { useLocation } from 'wouter';

import { AscendLogo } from '@/components/dashboard/AscendLogo';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { LeaderboardItem } from '@/components/dashboard/LeaderboardItem';
import { hierarchyMetrics, hierarchyData, businessValueData, currentUser } from '@/lib/mock-data';

// Icon mapping for navigation items
const iconComponents = {
  BarChart3,
  FileText,
  Users,
  Target,
  TrendingUp,
  MessageSquare,
  BookOpen,
  HelpCircle,
  Settings,
  LogOut,
  BarChart2
};

const navItems = [
  { icon: 'BarChart3', label: 'Dashboard', path: '/' },
  { icon: 'BarChart2', label: 'Team Performance', path: '/team-performance' },
  { icon: 'FileText', label: 'Business' },
  { icon: 'Users', label: 'Associates' },
  { icon: 'Target', label: 'HGI Direct' },
  { icon: 'TrendingUp', label: 'Reports' },
  { icon: 'MessageSquare', label: 'Marketing' },
  { icon: 'BookOpen', label: 'Resources' },
  { icon: 'HelpCircle', label: 'Help Center' }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [view, setView] = useState('recruiting');
  const [location, setLocation] = useLocation();

  const currentMetrics = hierarchyMetrics[activeTab as keyof typeof hierarchyMetrics];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Navigation */}
      <div className="w-64 bg-white border-r shadow-sm">
        <div className="p-4">
          <AscendLogo width={160} height={80} />
        </div>
        <nav className="mt-6 flex flex-col h-[calc(100vh-120px)]">
          {navItems.map((item, index) => {
            const IconComponent = iconComponents[item.icon as keyof typeof iconComponents];
            const isActive = item.path ? location === item.path : false;
            return (
              <a
                key={index}
                href={item.path || '#'}
                className={`flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 ${
                  isActive ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                <IconComponent size={20} />
                <span>{item.label}</span>
              </a>
            );
          })}
          <div className="mt-auto border-t">
            <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 w-full">
              <Settings size={20} />
              <span>Settings</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 w-full">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
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
                <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
                  <Avatar className="w-8 h-8">
                    <img src={currentUser.avatarUrl} alt={currentUser.name} />
                  </Avatar>
                  <span>Hello {currentUser.name}!</span>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl mb-2">HGI Builder Leaderboard</CardTitle>
                    <p className="text-gray-500 text-sm">Track your team's performance and rankings</p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                        view === 'recruiting' 
                          ? 'bg-blue-500 text-white shadow-md' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => setView('recruiting')}
                    >
                      Recruiting
                    </button>
                    <button
                      className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                        view === 'production' 
                          ? 'bg-blue-500 text-white shadow-md' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => setView('production')}
                    >
                      Production
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="baseShop">Base Shop</TabsTrigger>
                    <TabsTrigger value="rmdBase">RMD Base Shop</TabsTrigger>
                    <TabsTrigger value="superBase">RMD Super Base</TabsTrigger>
                  </TabsList>
                  <TabsContent value={activeTab}>
                    <div className="space-y-4">
                      {hierarchyData[activeTab as keyof typeof hierarchyData].map((item) => (
                        <LeaderboardItem key={item.id} item={item} view={view as 'recruiting' | 'production'} />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;