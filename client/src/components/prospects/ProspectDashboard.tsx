import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users, Search, Plus, Star,
  Phone, Mail, Calendar, ChevronDown, ChevronUp,
  BarChart2
} from 'lucide-react';
import { ProspectTimeline } from './ProspectTimeline';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Link } from "wouter";

// Define stages with their colors and descriptions
const stages = [
  { 
    id: 'initial', 
    name: 'Initial Contact', 
    color: 'bg-gray-100 border-gray-500',
    textColor: 'text-gray-700',
    description: 'First touchpoint with prospect'
  },
  { 
    id: 'bop', 
    name: 'BOP', 
    color: 'bg-blue-100 border-gray-500',
    textColor: 'text-blue-700',
    description: 'Basic Opportunity Profile'
  },
  { 
    id: 'financial', 
    name: 'Financial Review', 
    color: 'bg-purple-100 border-purple-500',
    textColor: 'text-purple-700',
    description: 'Financial Potential Assessment'
  },
  { 
    id: 'needs', 
    name: 'Needs Analysis', 
    color: 'bg-green-100 border-green-500',
    textColor: 'text-green-700',
    description: 'Detailed Needs Identification'
  },
  { 
    id: 'confidential', 
    name: 'Confidential Planning', 
    color: 'bg-amber-100 border-amber-500',
    textColor: 'text-amber-700',
    description: 'Private Financial Planning'
  },
  { 
    id: 'training', 
    name: 'Training Sales', 
    color: 'bg-rose-100 border-rose-500',
    textColor: 'text-rose-700',
    description: 'Sales Training Process'
  },
  { 
    id: 'promotion', 
    name: 'Promotion Ready', 
    color: 'bg-emerald-100 border-emerald-500',
    textColor: 'text-emerald-700',
    description: 'Ready for Advancement'
  }
];

// Generate sample prospects
const prospects = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: [
    'Emma Thompson', 'Michael Chen', 'Sarah Rodriguez', 'David Kim',
    'Rachel Patel', 'James Wilson', 'Maria Garcia', 'William Lee',
    'Jennifer Smith', 'Robert Johnson', 'Lisa Anderson', 'Kevin Park',
    'Diana Martinez', 'Thomas Wright', 'Amanda Lewis'
  ][i],
  stage: stages[Math.floor(Math.random() * stages.length)].id,
  potential: Math.floor(Math.random() * 50 + 50),
  lastContact: ['2 days ago', '1 week ago', 'Yesterday', '3 days ago'][Math.floor(Math.random() * 4)],
  nextAction: ['Follow-up call', 'Financial review', 'Send proposal', 'Schedule meeting'][Math.floor(Math.random() * 4)],
  avatar: `/api/placeholder/48/48?text=${[
    'ET', 'MC', 'SR', 'DK', 'RP', 'JW', 'MG', 'WL', 'JS', 'RJ',
    'LA', 'KP', 'DM', 'TW', 'AL'
  ][i]}`
}));

const ProspectCard = ({ prospect, stageColor, stageTextColor }) => {
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  // Mock activities data - this will come from the API in the real implementation
  const mockActivities = [
    {
      id: 1,
      type: 'call',
      title: 'Initial Contact Call',
      description: 'Discussed career opportunities and background',
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
      id: 2,
      type: 'email',
      title: 'Sent Follow-up Email',
      description: 'Shared information about our training program',
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: 3,
      type: 'meeting',
      title: 'Financial Planning Session',
      description: 'Scheduled a detailed discussion about financial goals',
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
      createdAt: new Date(),
    },
  ];

  return (
    <Card className="mb-3 hover:shadow-lg transition-all cursor-pointer border-l-4 w-full">
      <Collapsible open={isTimelineOpen} onOpenChange={setIsTimelineOpen}>
        <CardContent className="p-3">
          <div className="flex flex-col space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <img src={prospect.avatar} alt={prospect.name} className="w-full h-full object-cover" />
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-1">
                    {prospect.name}
                    {prospect.potential >= 75 && (
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    )}
                  </h3>
                  <div className="text-xs text-gray-500">
                    {prospect.lastContact}
                  </div>
                </div>
              </div>
              <Badge className={`${stageTextColor} text-xs`}>
                {prospect.potential}%
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                {prospect.nextAction}
              </span>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Phone className="w-3 h-3 text-gray-500" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Mail className="w-3 h-3 text-gray-500" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Calendar className="w-3 h-3 text-gray-500" />
                </button>
                <CollapsibleTrigger asChild>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    {isTimelineOpen ? (
                      <ChevronUp className="w-3 h-3 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-gray-500" />
                    )}
                  </button>
                </CollapsibleTrigger>
              </div>
            </div>
          </div>

          <CollapsibleContent>
            <div className="mt-3 pt-3 border-t">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Activity Timeline</h4>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Plus className="w-3 h-3 mr-1" />
                  Add Activity
                </Button>
              </div>
              <ProspectTimeline 
                activities={mockActivities}
                className="max-h-[300px] overflow-y-auto pr-2"
              />
            </div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
};

const ProspectDashboard = () => {
  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Prospect Pipeline</h1>
            <p className="text-gray-500">Manage prospects through different stages</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/prospects/analytics">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart2 size={20} />
                Analytics
              </Button>
            </Link>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search prospects..."
                className="pl-10 w-64"
              />
            </div>
            <Button className="flex items-center gap-2">
              <Plus size={20} />
              Add Prospect
            </Button>
          </div>
        </div>

        {/* Stage Columns */}
        <div className="grid grid-cols-7 gap-4 h-[calc(100vh-130px)] overflow-hidden">
          {stages.map(stage => (
            <div key={stage.id} className="flex flex-col min-w-[250px]">
              <div className={`p-3 rounded-t-lg ${stage.color}`}>
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-semibold ${stage.textColor} text-sm`}>{stage.name}</h3>
                  <Badge variant="secondary" className={`${stage.textColor} text-xs`}>
                    {prospects.filter(p => p.stage === stage.id).length}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">{stage.description}</p>
              </div>
              <div 
                className={`p-2 bg-gray-50 rounded-b-lg flex-1 overflow-y-auto
                  ${stage.id === 'confidential' ? 'bg-amber-50/50' : ''}
                  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent`}
              >
                {prospects
                  .filter(prospect => prospect.stage === stage.id)
                  .map(prospect => (
                    <ProspectCard 
                      key={prospect.id} 
                      prospect={prospect}
                      stageColor={stage.color}
                      stageTextColor={stage.textColor}
                    />
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProspectDashboard;