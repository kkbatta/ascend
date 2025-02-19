import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, Clock, Target, Bot, Send } from 'lucide-react';

// Mock data - will be replaced with real data from API
const stageConversionData = [
  { name: 'Initial Contact', value: 100 },
  { name: 'BOP', value: 85 },
  { name: 'Financial Review', value: 65 },
  { name: 'Needs Analysis', value: 45 },
  { name: 'Confidential Planning', value: 30 },
  { name: 'Training Sales', value: 20 },
  { name: 'Promotion Ready', value: 15 },
];

const timeInStageData = [
  { name: 'Initial Contact', avgDays: 3 },
  { name: 'BOP', avgDays: 7 },
  { name: 'Financial Review', avgDays: 14 },
  { name: 'Needs Analysis', avgDays: 10 },
  { name: 'Confidential Planning', avgDays: 21 },
  { name: 'Training Sales', avgDays: 30 },
  { name: 'Promotion Ready', avgDays: 14 },
];

const conversionTrendData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  rate: 30 + Math.random() * 20,
}));

const potentialDistributionData = [
  { name: 'High', value: 30, color: '#22c55e' },
  { name: 'Medium', value: 45, color: '#3b82f6' },
  { name: 'Low', value: 25, color: '#ef4444' },
];

const AgentDialog = ({ isOpen, onClose, metricTitle, metricValue, trend }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `I've analyzed the ${metricTitle.toLowerCase()} metrics. What would you like to know about the current performance?`
    }
  ]);
  const [input, setInput] = useState('');

  const mockResponses = {
    'Active Prospects': [
      "Based on the current number of prospects (245), I recommend focusing on the following:\n\n1. Implement a weekly check-in schedule for prospects in later stages\n2. Consider automated nurture campaigns for early-stage prospects\n3. Your 12% increase is promising, but there's room for better qualification",
      "Looking at the prospect distribution, here's what we can improve:\n\n1. Set up automated follow-up sequences\n2. Implement a lead scoring system\n3. Focus on quality over quantity in prospect acquisition",
    ],
    'Avg. Conversion Time': [
      "The current 45-day conversion cycle could be optimized by:\n\n1. Identifying bottlenecks in the Financial Review stage\n2. Streamlining the documentation process\n3. Setting up automated reminders for next steps",
      "To improve the conversion time, consider:\n\n1. Creating stage-specific content resources\n2. Implementing a fast-track program for high-potential prospects\n3. Regular pipeline review meetings",
    ],
    'Conversion Rate': [
      "Your 32% conversion rate shows promise. Here's how to improve:\n\n1. Focus on prospects with scores above 75\n2. Implement a referral program\n3. Create success story showcases",
      "To boost the conversion rate further:\n\n1. Analyze successful conversions for common patterns\n2. Develop targeted training materials\n3. Set up milestone-based engagement programs",
    ]
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: 'user', content: input },
    ];
    setMessages(newMessages);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const responses = mockResponses[metricTitle];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages([...newMessages, { role: 'assistant', content: randomResponse }]);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Analysis: {metricTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[400px]">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this metric..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const MetricCard = ({ title, value, trend, icon: Icon }) => {
  const [isAgentOpen, setIsAgentOpen] = useState(false);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="flex gap-2">
            <div className="p-2 bg-gray-100 rounded-full">
              <Icon className="w-4 h-4 text-gray-600" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAgentOpen(true)}
              className="rounded-full"
            >
              <Bot className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center space-x-2">
            {trend > 0 ? (
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${
              trend > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {Math.abs(trend)}% vs last month
            </span>
          </div>
        )}
        <AgentDialog
          isOpen={isAgentOpen}
          onClose={() => setIsAgentOpen(false)}
          metricTitle={title}
          metricValue={value}
          trend={trend}
        />
      </CardContent>
    </Card>
  );
};

export const ProspectAnalytics = () => {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Active Prospects"
          value="245"
          trend={12}
          icon={Users}
        />
        <MetricCard
          title="Avg. Conversion Time"
          value="45 days"
          trend={-5}
          icon={Clock}
        />
        <MetricCard
          title="Conversion Rate"
          value="32%"
          trend={8}
          icon={Target}
        />
      </div>

      {/* Stage Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Stage Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stageConversionData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time in Stage */}
        <Card>
          <CardHeader>
            <CardTitle>Average Time in Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timeInStageData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgDays" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Potential Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Potential Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={potentialDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {potentialDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Rate Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={conversionTrendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};