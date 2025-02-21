import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Lightbulb, Check, Loader2, Bot, Send, Plus, Trash2, Code } from 'lucide-react';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Update defaultIdeas with enhanced ideas
const defaultIdeas = {
  '/golden-era': [
    'Enable multi-policy income planning simulation',
    'Add beneficiary relationship visualization',
    'Create automated policy renewal tracking system',
    'Implement policy comparison matrix with AI insights',
    'Add retirement lifestyle goal planning',
    'Enable estate tax impact analysis',
    'Create spouse coverage gap analysis',
    'Implement policy performance benchmarking',
    'Add retirement income distribution modeling',
    'Create legacy planning visualization tools',
    'AI-powered risk assessment dashboard',
    'Real-time policy performance monitoring',
    'Automated beneficiary updates system',
    'Multi-currency support for international clients',
    'Advanced tax optimization calculator'
  ],
  '/business': [
    'Add business metrics dashboard customization',
    'Implement revenue forecasting with AI',
    'Create business health score calculator',
    'Add provider performance comparison tools',
    'Implement automated reporting schedules',
    'Create business growth trajectory analysis'
  ],
  '/business/overview': [
    'Add interactive business metrics widgets',
    'Implement real-time performance alerts',
    'Create custom KPI tracking system',
    'Add market trend analysis dashboard',
    'Implement goal progress visualization',
    'Create business health monitoring system'
  ],
  '/business/details': [
    'Add detailed transaction history exports',
    'Implement document version control',
    'Create business relationship mapping',
    'Add provider contract management',
    'Implement renewal date tracking',
    'Create policy portfolio analysis'
  ],
  '/business/team': [
    'Add team performance benchmarking',
    'Implement team goal setting interface',
    'Create team achievement tracking',
    'Add team member development plans',
    'Implement team hierarchy visualization',
    'Create team collaboration metrics'
  ],
  '/business/compensation': [
    'Add commission template version control',
    'Implement commission scenario modeling',
    'Create override structure visualization',
    'Add bonus qualification tracking',
    'Implement commission dispute resolution system',
    'Create commission payout forecasting',
    'Add automated commission calculations',
    'Implement multi-level override calculator',
    'Create commission statement generator',
    'Add commission plan comparison tools',
    'Implement historical commission analysis',
    'Create commission rule impact simulator',
    'AI-driven commission optimization',
    'Real-time commission tracking dashboard',
    'Team performance predictor',
    'Commission structure analyzer'
  ]
};

// Keep existing API functions and add implementation function
const generateImplementation = async (idea: string, context: string, apiKey: string) => {
  const response = await fetch('/api/generate-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-openai-key': apiKey
    },
    body: JSON.stringify({ idea, context }),
  });
  if (!response.ok) throw new Error('Failed to generate implementation');
  return response.json();
};

export const IdeasButton = () => {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [newIdea, setNewIdea] = useState('');
  const [openAIKey, setOpenAIKey] = useState('');
  const [implementationDialogOpen, setImplementationDialogOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch ideas from the database
  const { data: customIdeas = [] } = useQuery({
    queryKey: ['ideas', location],
    queryFn: () => fetchIdeas(location),
  });

  // Add new idea mutation
  const addIdeaMutation = useMutation({
    mutationFn: addIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas', location] });
      setNewIdea('');
      toast({
        title: "Idea added",
        description: "Your idea has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to add idea",
        description: "There was an error saving your idea. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete idea mutation
  const deleteIdeaMutation = useMutation({
    mutationFn: deleteIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas', location] });
      toast({
        title: "Idea deleted",
        description: "The idea has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete idea",
        description: "There was an error deleting the idea. Please try again.",
        variant: "destructive",
      });
    },
  });

  const implementationMutation = useMutation({
    mutationFn: ({ idea, context, apiKey }: { idea: string; context: string; apiKey: string }) =>
      generateImplementation(idea, context, apiKey),
    onSuccess: (data) => {
      toast({
        title: "Implementation generated",
        description: "Check the implementation details in the dialog.",
      });
      // Here you could handle the implementation data, e.g., show it in a new dialog
      console.log('Implementation:', data);
    },
    onError: () => {
      toast({
        title: "Failed to generate implementation",
        description: "Please check your OpenAI API key and try again.",
        variant: "destructive",
      });
    },
  });

  const handleImplementation = async () => {
    if (!selectedIdea || !openAIKey) return;

    setIsGenerating(true);
    try {
      await implementationMutation.mutateAsync({
        idea: selectedIdea,
        context: location,
        apiKey: openAIKey
      });
    } finally {
      setIsGenerating(false);
    }
  };


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

  const handleAddIdea = async () => {
    if (!newIdea.trim()) return;

    addIdeaMutation.mutate({
      pagePath: location,
      content: newIdea.trim(),
    });
  };

  const allIdeas = [
    ...(defaultIdeas[location as keyof typeof defaultIdeas] || []).map(content => ({
      id: content,
      content,
      isCustom: false
    })),
    ...customIdeas
  ];

  const completedCount = allIdeas.filter(idea => checkedItems[idea.id]).length;

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
                ({completedCount}/{allIdeas.length})
              </span>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {allIdeas.map((idea) => (
                <div key={idea.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`idea-${idea.id}`}
                    checked={checkedItems[idea.id] || false}
                    onCheckedChange={(checked) => {
                      setCheckedItems(prev => ({
                        ...prev,
                        [idea.id]: checked,
                      }));
                    }}
                  />
                  <label
                    htmlFor={`idea-${idea.id}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 flex-1"
                  >
                    {idea.content}
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        setSelectedIdea(idea.content);
                        setImplementationDialogOpen(true);
                      }}
                    >
                      <Code className="h-4 w-4" />
                    </Button>
                    {idea.isCustom && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => deleteIdeaMutation.mutate(idea.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex gap-2 mt-4">
            <Input
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              placeholder="Add your own idea..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddIdea()}
            />
            <Button onClick={handleAddIdea} disabled={!newIdea.trim() || addIdeaMutation.isPending}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={implementationDialogOpen} onOpenChange={setImplementationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Implement Enhancement</DialogTitle>
            <DialogDescription>
              Enter your OpenAI API key to generate implementation code for this enhancement.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Selected Idea:</h4>
              <p className="text-sm">{selectedIdea}</p>
            </div>
            <div>
              <label className="text-sm font-medium">OpenAI API Key</label>
              <Input
                type="password"
                value={openAIKey}
                onChange={(e) => setOpenAIKey(e.target.value)}
                placeholder="sk-..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleImplementation}
              disabled={!openAIKey || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Code className="h-4 w-4 mr-2" />
                  Generate Implementation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
const fetchIdeas = async (pagePath: string) => {
  const response = await fetch(`/api/ideas?pagePath=${pagePath}`);
  if (!response.ok) throw new Error('Failed to fetch ideas');
  return response.json();
};

const addIdea = async (idea: { pagePath: string; content: string }) => {
  const response = await fetch('/api/ideas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(idea),
  });
  if (!response.ok) throw new Error('Failed to add idea');
  return response.json();
};

const deleteIdea = async (id: number) => {
  const response = await fetch(`/api/ideas/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete idea');
};