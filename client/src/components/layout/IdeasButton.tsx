import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Lightbulb } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

// Page-specific enhancement ideas
const pageIdeas = {
  '/': [
    'Add personalized quick actions based on user role',
    'Implement dark mode support',
    'Add keyboard shortcuts for common actions',
    'Show performance trends over custom date ranges',
  ],
  '/prospects': [
    'Enable automated stage transition notifications',
    'Add prospect scoring algorithm based on engagement',
    'Implement drag-and-drop for prospect cards between stages',
    'Add bulk actions for prospects (e.g., bulk stage update)',
    'Enable prospect card color coding based on priority/score',
    'Add prospect history export functionality',
    'Implement prospect merge for duplicate detection',
    'Add prospect activity reminders and notifications',
  ],
  '/prospects/analytics': [
    'Add AI-powered conversion predictions',
    'Implement custom date range comparisons',
    'Add team performance breakdowns',
    'Enable custom metric tracking',
    'Add prospect source attribution analytics',
    'Implement funnel visualization options',
    'Add cohort analysis capabilities',
    'Enable data export in multiple formats',
  ],
  '/team-performance': [
    'Add team member achievements and badges',
    'Implement performance goal tracking',
    'Add peer recognition system',
    'Enable custom performance metrics',
    'Add team collaboration insights',
    'Implement skill gap analysis',
    'Add training completion tracking',
    'Enable performance trend forecasting',
  ],
  '/associates': [
    'Add skill matrix visualization',
    'Implement mentorship matching',
    'Add career path planning tools',
    'Enable custom associate groups',
    'Add associate availability calendar',
    'Implement associate rating system',
    'Add associate document management',
    'Enable associate performance comparisons',
  ],
};

export const IdeasButton = () => {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Load checked state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('ideasCheckedState');
    if (savedState) {
      setCheckedItems(JSON.parse(savedState));
    }
  }, []);

  // Save checked state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('ideasCheckedState', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggleItem = (idea: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [idea]: !prev[idea]
    }));
  };

  const currentPageIdeas = pageIdeas[location] || pageIdeas['/'];
  const completedCount = currentPageIdeas.filter(idea => checkedItems[idea]).length;

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-white shadow-lg hover:shadow-xl transition-shadow"
        onClick={() => setIsOpen(true)}
      >
        <Lightbulb className="w-5 h-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="w-5 h-5" />
              Enhancement Ideas
              <span className="text-sm text-gray-500 ml-2">
                ({completedCount}/{currentPageIdeas.length})
              </span>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {currentPageIdeas.map((idea, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Checkbox
                    id={`idea-${index}`}
                    checked={checkedItems[idea] || false}
                    onCheckedChange={() => toggleItem(idea)}
                  />
                  <label
                    htmlFor={`idea-${index}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {idea}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
