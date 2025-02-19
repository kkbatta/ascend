import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users, Search, Plus, MoreVertical, Star,
  Phone, Mail, Calendar
} from 'lucide-react';

const ProspectDashboard = () => {
  // Define stages with their colors and descriptions
  const stages = [
    { 
      id: 'bop', 
      name: 'BOP', 
      color: 'bg-blue-100 border-blue-500',
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
      description: 'Instant Needs Identification'
    },
    { 
      id: 'confidential', 
      name: 'Confidential Planning', 
      color: 'bg-amber-100 border-amber-500',
      textColor: 'text-amber-700',
      description: 'Private Financial Planning'
    },
    { 
      id: 'business', 
      name: 'Business Planning', 
      color: 'bg-rose-100 border-rose-500',
      textColor: 'text-rose-700',
      description: 'Business vs Builder Analysis'
    }
  ];

  // Generate random prospects
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

  const ProspectCard = ({ prospect, stageColor, stageTextColor }) => (
    <Card className="mb-4 hover:shadow-lg transition-all cursor-pointer border-l-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-10 h-10">
              <img src={prospect.avatar} alt={prospect.name} />
            </Avatar>
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                {prospect.name}
                {prospect.potential >= 75 && (
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                )}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{prospect.lastContact}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm font-medium">
              Potential Score
            </div>
            <Badge className={stageTextColor}>
              {prospect.potential}%
            </Badge>
          </div>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {prospect.nextAction}
          </div>
          <div className="flex gap-2">
            <button className="p-1 hover:bg-gray-100 rounded">
              <Phone className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Mail className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Calendar className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Prospect Pipeline</h1>
            <p className="text-gray-500">Manage prospects through different stages</p>
          </div>
          <div className="flex items-center gap-4">
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
        <div className="grid grid-cols-5 gap-4 mt-8">
          {stages.map(stage => (
            <div key={stage.id} className="flex flex-col">
              <div className={`p-4 rounded-t-lg ${stage.color}`}>
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-semibold ${stage.textColor}`}>{stage.name}</h3>
                  <Badge variant="secondary" className={stage.textColor}>
                    {prospects.filter(p => p.stage === stage.id).length}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{stage.description}</p>
              </div>
              <div className={`p-4 bg-gray-50 rounded-b-lg flex-1 min-h-[calc(100vh-250px)] ${stage.id === 'confidential' ? 'bg-amber-50/50' : ''}`}>
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