import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Copy, Users, TrendingUp, Search, DollarSign, BarChart3, ArrowUpRight,
  FileText, Target, MessageSquare, HelpCircle, LogOut, CreditCard,
  BookOpen, Settings, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [view, setView] = useState('recruiting');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const { toast } = useToast();

  const currentUser = {
    name: "Rajitha",
    role: "Team Lead",
    avatarUrl: "/api/placeholder/40/40?text=RT",
    referralCode: "RAJ-X7Y2Z9" // This would come from the API
  };

  const navItems = [
    { icon: <BarChart3 size={20} />, label: 'Dashboard', active: true },
    { icon: <FileText size={20} />, label: 'Business' },
    { icon: <Users size={20} />, label: 'Associates' },
    { icon: <Target size={20} />, label: 'HGI Direct' },
    { icon: <TrendingUp size={20} />, label: 'Reports' },
    { icon: <MessageSquare size={20} />, label: 'Marketing' },
    { icon: <BookOpen size={20} />, label: 'Resources' },
    { icon: <HelpCircle size={20} />, label: 'Help Center' }
  ];

  const hierarchyMetrics = {
    personal: {
      teamSize: 45,
      monthlyRevenue: 95000,
      newRecruits: 12,
      teamProduction: 450000
    },
    baseShop: {
      teamSize: 285,
      monthlyRevenue: 568000,
      newRecruits: 45,
      teamProduction: 2876000
    },
    rmdBase: {
      teamSize: 1250,
      monthlyRevenue: 2485000,
      newRecruits: 142,
      teamProduction: 12450000
    },
    superBase: {
      teamSize: 5200,
      monthlyRevenue: 8850000,
      newRecruits: 465,
      teamProduction: 48800000
    }
  };

  const hierarchyData = {
    personal: [
      {
        id: 1,
        name: 'Thomas Anderson',
        location: 'Phoenix, AZ',
        rank: 'EFC',
        rv: 7.8,
        production: 125000,
        recruits: 8,
        teamSize: 45,
        avatarUrl: "/api/placeholder/48/48?text=TA"
      },
      {
        id: 2,
        name: 'Sarah Connor',
        location: 'Seattle, WA',
        rank: 'TA',
        rv: 6.5,
        production: 98000,
        recruits: 5,
        teamSize: 28,
        avatarUrl: "/api/placeholder/48/48?text=SC"
      }
    ],
    baseShop: [
      {
        id: 1,
        name: 'James Wilson',
        location: 'Chicago, IL',
        rank: 'RMD',
        rv: 9.2,
        production: 950000,
        recruits: 32,
        teamSize: 285,
        avatarUrl: "/api/placeholder/48/48?text=JW"
      }
    ],
    rmdBase: [
      {
        id: 1,
        name: 'Elizabeth Chen',
        location: 'San Francisco, CA',
        rank: 'SMD',
        rv: 12.5,
        production: 2850000,
        recruits: 85,
        teamSize: 1250,
        avatarUrl: "/api/placeholder/48/48?text=EC"
      }
    ],
    superBase: [
      {
        id: 1,
        name: 'Robert Martinez',
        location: 'Miami, FL',
        rank: 'NMD',
        rv: 15.8,
        production: 8500000,
        recruits: 145,
        teamSize: 5200,
        avatarUrl: "/api/placeholder/48/48?text=RM"
      }
    ]
  };

  const currentMetrics = hierarchyMetrics[activeTab];

  const MetricsCard = ({ title, value, icon, trend }) => (
    <Card className="bg-white hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50">{icon}</div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-green-500">
              <ArrowUpRight size={16} />
              <span className="text-sm font-medium">{trend}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const LeaderboardItem = ({ item }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 ring-2 ring-offset-2 ring-blue-500">
            <img src={item.avatarUrl} alt={item.name} />
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-lg">{item.name}</p>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                {item.rank}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">{item.location}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {view === 'recruiting' ? (
            <>
              <Badge variant="success" className="bg-green-500 text-white px-3 py-1">
                {item.rv} RV
              </Badge>
              <span className="text-sm text-gray-600">
                {item.recruits} New Recruits
              </span>
            </>
          ) : (
            <>
              <Badge variant="success" className="bg-blue-500 text-white px-3 py-1">
                ${item.production.toLocaleString()}
              </Badge>
              <span className="text-sm text-gray-600">
                Team Size: {item.teamSize}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/register?ref=${currentUser.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Referral link copied!",
      description: "Share this link with your prospects to grow your team.",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Navigation */}
      <div className="w-64 bg-white border-r shadow-sm">
        <div className="p-4">
          <div className="text-2xl font-bold text-blue-600">ASCEND</div>
        </div>
        <nav className="mt-6">
          {navItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 ${
                item.active ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
          <div className="mt-auto pt-4 border-t">
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
      <div className="flex-1">
        <div className="p-6">
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
                    placeholder="Search Here"
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
                    className="flex items-center gap-2"
                    onClick={copyReferralLink}
                  >
                    <Link size={16} />
                    <span>Share Referral</span>
                  </Button>
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
            <Card className="mb-8">
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
                      {hierarchyData[activeTab].map((item) => (
                        <LeaderboardItem key={item.id} item={item} />
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