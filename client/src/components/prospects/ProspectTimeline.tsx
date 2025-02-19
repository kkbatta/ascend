import React from 'react';
import { format } from 'date-fns';
import { 
  Phone, Mail, Calendar, MessageSquare, 
  ArrowUpRight, Clock, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Activity = {
  id: number;
  type: string;
  title: string;
  description?: string;
  scheduledAt?: Date;
  completedAt?: Date;
  createdAt: Date;
};

type TimelineProps = {
  activities: Activity[];
  className?: string;
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'call':
      return <Phone className="w-4 h-4" />;
    case 'email':
      return <Mail className="w-4 h-4" />;
    case 'meeting':
      return <Calendar className="w-4 h-4" />;
    case 'note':
      return <MessageSquare className="w-4 h-4" />;
    case 'stage_change':
      return <ArrowUpRight className="w-4 h-4" />;
    default:
      return <MessageSquare className="w-4 h-4" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'call':
      return 'bg-blue-100 text-blue-700';
    case 'email':
      return 'bg-purple-100 text-purple-700';
    case 'meeting':
      return 'bg-green-100 text-green-700';
    case 'note':
      return 'bg-gray-100 text-gray-700';
    case 'stage_change':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const ProspectTimeline: React.FC<TimelineProps> = ({ activities, className }) => {
  return (
    <div className={cn("space-y-4", className)}>
      {activities.map((activity, index) => (
        <div key={activity.id} className="relative">
          {/* Connection line */}
          {index !== activities.length - 1 && (
            <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-200" />
          )}
          
          <div className="flex gap-4">
            {/* Activity icon */}
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              getActivityColor(activity.type)
            )}>
              {getActivityIcon(activity.type)}
            </div>
            
            {/* Activity content */}
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm">{activity.title}</h4>
                <time className="text-xs text-gray-500">
                  {format(new Date(activity.createdAt), 'MMM d, h:mm a')}
                </time>
              </div>
              
              {activity.description && (
                <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
              )}
              
              {/* Status indicators */}
              {(activity.scheduledAt || activity.completedAt) && (
                <div className="flex items-center gap-2 text-xs">
                  {activity.scheduledAt && !activity.completedAt && (
                    <div className="flex items-center gap-1 text-amber-600">
                      <Clock className="w-3 h-3" />
                      <span>Scheduled for {format(new Date(activity.scheduledAt), 'MMM d, h:mm a')}</span>
                    </div>
                  )}
                  {activity.completedAt && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Completed {format(new Date(activity.completedAt), 'MMM d, h:mm a')}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
