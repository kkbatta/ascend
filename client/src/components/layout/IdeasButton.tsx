import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Lightbulb, Check, Loader2, Bot, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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

interface GenerateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  idea: string;
  onConfirm: (apiKey: string) => void;
}

const GenerateDialog: React.FC<GenerateDialogProps> = ({
  isOpen,
  onClose,
  idea,
  onConfirm,
}) => {
  const [apiKey, setApiKey] = useState('');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Code for Enhancement</DialogTitle>
          <DialogDescription>
            This will use OpenAI to implement:
            <div className="mt-2 font-medium text-foreground">{idea}</div>

            <div className="mt-4 space-y-2">
              <p className="text-sm">Please provide your OpenAI API key:</p>
              <Input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                You can get your API key from{' '}
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  platform.openai.com/api-keys
                </a>
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={() => onConfirm(apiKey)}
            disabled={!apiKey.startsWith('sk-')}
          >
            Generate & Implement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const IdeasButton = () => {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [generatingIdea, setGeneratingIdea] = useState<string | null>(null);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<string>('');
  const { toast } = useToast();

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

  const handleGenerateCode = async (idea: string, apiKey: string) => {
    setGeneratingIdea(idea);
    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-OpenAI-Key': apiKey,
        },
        body: JSON.stringify({
          idea,
          context: location,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate code');
      }

      const result = await response.json();

      // Show success toast
      toast({
        title: "Enhancement implemented",
        description: "The changes have been applied successfully. The page will refresh shortly.",
      });

      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to implement the enhancement. Please try again.",
        variant: "destructive",
      });
      setCheckedItems(prev => ({
        ...prev,
        [idea]: false
      }));
    } finally {
      setGeneratingIdea(null);
      setShowGenerateDialog(false);
    }
  };

  const toggleItem = (idea: string) => {
    if (checkedItems[idea]) {
      // Unchecking is immediate
      setCheckedItems(prev => ({
        ...prev,
        [idea]: false
      }));
    } else {
      // Show confirmation dialog before checking
      setSelectedIdea(idea);
      setShowGenerateDialog(true);
    }
  };

  const handleConfirmGenerate = (apiKey: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [selectedIdea]: true
    }));
    handleGenerateCode(selectedIdea, apiKey);
  };

  const currentPageIdeas = pageIdeas[location as keyof typeof pageIdeas] || pageIdeas['/'];
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
                    disabled={generatingIdea === idea}
                  />
                  <label
                    htmlFor={`idea-${index}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                  >
                    {idea}
                    {generatingIdea === idea && (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    )}
                    {checkedItems[idea] && generatingIdea !== idea && (
                      <Check className="w-3 h-3 text-green-500" />
                    )}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <GenerateDialog
        isOpen={showGenerateDialog}
        onClose={() => setShowGenerateDialog(false)}
        idea={selectedIdea}
        onConfirm={handleConfirmGenerate}
      />
    </>
  );
};