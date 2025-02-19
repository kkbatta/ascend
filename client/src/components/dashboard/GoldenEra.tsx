import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Coffee, DollarSign, TrendingUp } from 'lucide-react';

interface Policy {
  id: string;
  type: string;
  startDate: string;
  value: number;
  status: string;
}

interface RetiredCustomer {
  id: string;
  name: string;
  age: number;
  retirementYear: number;
  netWorth: number;
  pastPolicies: Policy[];
}

const GoldenEra = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<RetiredCustomer | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);

  // Fetch retired customers data
  const { data: retiredCustomers, isLoading } = useQuery({
    queryKey: ['/api/retired-customers'],
    select: (data: RetiredCustomer[]) => data
  });

  // Handle chat message submission
  const handleChatSubmit = async () => {
    if (!chatMessage.trim() || !selectedCustomer) return;

    // Add user message to chat
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
    }

    setChatMessage('');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - Customer List */}
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="h-5 w-5" />
              Retired Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {retiredCustomers?.map((customer) => (
                  <div
                    key={customer.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedCustomer?.id === customer.id
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-secondary'
                    }`}
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <h3 className="font-medium">{customer.name}</h3>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <span>Age: {customer.age}</span>
                      <span>•</span>
                      <span>Retired: {customer.retirementYear}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm">Net Worth: ${customer.netWorth.toLocaleString()}</span>
                    </div>
                  </div>
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
                    <h3 className="font-medium">Past Policies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedCustomer.pastPolicies.map((policy) => (
                        <div key={policy.id} className="p-4 rounded-lg border">
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
                      ))}
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
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Ask about policy recommendations..."
                      onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                    />
                    <Button onClick={handleChatSubmit}>Send</Button>
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