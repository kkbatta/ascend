import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  Search, 
  DollarSign, 
  BarChart3, 
  ArrowUpRight,
  FileText, 
  Target, 
  MessageSquare, 
  HelpCircle, 
  LogOut, 
  CreditCard,
  BookOpen, 
  ChevronRight,
  Settings
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [view, setView] = useState('recruiting');

  // Sample business value data
  const businessValueData = [
    { month: 'Jan', actual: 85000, target: 100000, projected: 95000 },
    { month: 'Feb', actual: 92000, target: 105000, projected: 98000 },
    { month: 'Mar', actual: 108000, target: 110000, projected: 112000 },
    { month: 'Apr', actual: 115000, target: 115000, projected: 118000 }
  ];

  // Sample team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Thomas Anderson',
      rank: 'EFC',
      location: 'Phoenix, AZ',
      activityScore: 85,
      production: 125000,
      lastActive: '2 hours ago',
      avatarUrl: "/api/placeholder/48/48?text=TA"
    },
    {
      id: 2,
      name: 'Sarah Connor',
      rank: 'TA',
      location: 'Seattle, WA',
      activityScore: 92,
      production: 98000,
      lastActive: '1 hour ago',
      avatarUrl: "/api/placeholder/48/48?text=SC"
    },
    {
      id: 3,
      name: 'James Wilson',
      rank: 'RMD',
      location: 'Chicago, IL',
      activityScore: 78,
      production: 85000,
      lastActive: '3 hours ago',
      avatarUrl: "/api/placeholder/48/48?text=JW"
    }
  ];

  const currentUser = {
    name: "Rajitha",
    role: "Team Lead",
    avatarUrl: "/api/placeholder/40/40?text=RT"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header with user info */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Business Overview</h1>
              <p className="text-gray-500">Track your performance and team metrics</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
              <Avatar className="w-8 h-8">
                <img src={currentUser.avatarUrl} alt={currentUser.name} />
              </Avatar>
              <span>Hello {currentUser.name}!</span>
            </div>
          </div>

          {/* Business Value Tracking */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl mb-2">Business Value Tracking</CardTitle>
                  <p className="text-gray-500 text-sm">Track your progress towards annual target</p>
                </div>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => window.open('/training/business-growth', '_blank')}
                >
                  <BookOpen size={16} />
                  View Growth Resources
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={businessValueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#6366F1" strokeWidth={2} name="Actual Business" />
                    <Line type="monotone" dataKey="target" stroke="#EC4899" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                    <Line type="monotone" dataKey="projected" stroke="#8B5CF6" strokeWidth={2} name="Projected" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">Recommendations to Reach Target:</h4>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Schedule 3 more client meetings this week</li>
                  <li>Follow up with 5 pending applications</li>
                  <li>Review training material on SecureHorizon product</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Team Activity Monitor */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl mb-2">Team Activity Monitor</CardTitle>
                  <p className="text-gray-500 text-sm">Track team engagement and performance</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 ring-2 ring-offset-2 ring-blue-500">
                        <img src={member.avatarUrl} alt={member.name} />
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{member.name}</h3>
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                            {member.rank}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{member.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-sm text-gray-500">Activity Score</p>
                        <div className="flex items-center gap-2">
                          <Badge className={`${
                            member.activityScore > 80 ? 'bg-green-500' : 'bg-yellow-500'
                          } text-white px-3 py-1`}>
                            {member.activityScore}%
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Production</p>
                        <p className="font-bold">${member.production.toLocaleString()}</p>
                      </div>
                      <button 
                        className="p-2 hover:bg-gray-100 rounded-full"
                        onClick={() => window.open(`/team-member/${member.id}`, '_blank')}
                      >
                        <ChevronRight size={20} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;