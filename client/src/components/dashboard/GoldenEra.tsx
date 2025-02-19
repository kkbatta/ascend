import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Coffee, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  Shield,
  HeartPulse,
  Target
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { retiredCustomers, retirementProducts } from '@/lib/mock-data';

const GoldenEra = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Handle chat message submission
  const handleChatSubmit = async () => {
    if (!chatMessage.trim() || !selectedCustomer) return;

    setIsAnalyzing(true);
    setChatHistory(prev => [...prev, { role: 'user', content: chatMessage }]);

    try {
      const response = await fetch('/api/analyze-policy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomer.id,
          message: chatMessage,
          policies: selectedCustomer.pastPolicies
        })
      });

      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error analyzing policy:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error while analyzing the policy. Please try again.' 
      }]);
    }

    setIsAnalyzing(false);
    setChatMessage('');
  };

  const PolicyCard = ({ policy }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="p-4 rounded-lg border hover:border-primary transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{policy.type}</h4>
                <p className="text-sm text-muted-foreground">
                  Started: {new Date(policy.startDate).toLocaleDateString()}
                </p>
              </div>
              <Badge>{policy.status}</Badge>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>${policy.value.toLocaleString()}</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-80 p-4">
          <div className="space-y-2">
            <h5 className="font-medium">Policy Performance</h5>
            {Object.entries(policy.performance).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const CustomerCard = ({ customer }) => (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
        selectedCustomer?.id === customer.id
          ? 'bg-primary/10 border-primary'
          : 'hover:bg-secondary'
      }`}
      onClick={() => setSelectedCustomer(customer)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{customer.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground">Age: {customer.age}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              Retired: {customer.retirementYear}
            </span>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm font-medium">
                  ${customer.netWorth.toLocaleString()}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Risk Tolerance: {customer.riskTolerance}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartPulse className="h-4 w-4" />
                  <span>Health: {customer.healthStatus}</span>
                </div>
                {customer.spouse && (
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span>Spouse: {customer.spouse.name} ({customer.spouse.age})</span>
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {customer.concerns.slice(0, 2).map((concern, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {concern}
          </Badge>
        ))}
        {customer.concerns.length > 2 && (
          <Badge variant="secondary" className="text-xs">
            +{customer.concerns.length - 2} more
          </Badge>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - Customer List */}
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="h-5 w-5" />
              Golden Era Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {retiredCustomers.map((customer) => (
                  <CustomerCard key={customer.id} customer={customer} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right side - Policy Analysis & Chat */}
        <div className="w-full md:w-2/3 space-y-6">
          {selectedCustomer ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Policy Analysis - {selectedCustomer.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <h3 className="font-medium mb-2">Current Policies</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedCustomer.pastPolicies.map((policy) => (
                            <PolicyCard key={policy.id} policy={policy} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    AI Policy Advisor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] mb-4">
                    <div className="space-y-4">
                      {chatHistory.map((msg, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg ${
                            msg.role === 'assistant' 
                              ? 'bg-primary/10 ml-4' 
                              : 'bg-secondary mr-4'
                          }`}
                        >
                          {msg.content}
                        </div>
                      ))}
                      {isAnalyzing && (
                        <div className="flex items-center gap-2 text-muted-foreground p-4">
                          <AlertCircle className="h-4 w-4 animate-pulse" />
                          <span>Analyzing...</span>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Ask about policy recommendations..."
                      onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                    />
                    <Button onClick={handleChatSubmit} disabled={isAnalyzing}>
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Select a customer to view their policy analysis and get AI-powered recommendations
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoldenEra;