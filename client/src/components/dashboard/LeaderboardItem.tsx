import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface LeaderboardItemProps {
  item: {
    id: number;
    name: string;
    location: string;
    rank: string;
    rv: number;
    production: number;
    recruits: number;
    teamSize: number;
    avatarUrl: string;
  };
  view: 'recruiting' | 'production';
}

export const LeaderboardItem = ({ item, view }: LeaderboardItemProps) => (
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
