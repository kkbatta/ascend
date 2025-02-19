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
  Target,
  User,
  FileText,
  Users,
  Home
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { retiredCustomers, retirementProducts, insuranceProviders } from '@/lib/mock-data';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const GoldenEra = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [showProductComparison, setShowProductComparison] = useState(false);

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
          policies: selectedCustomer.pastPolicies,
          selectedProducts,
          selectedProviders
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

  const CustomerProfile = ({ customer }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="ml-2">
          <User className="h-4 w-4 mr-2" />
          Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customer Profile</DialogTitle>
          <DialogDescription>
            Detailed information about {customer.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`} />
                <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{customer.name}</h3>
                <p className="text-sm text-muted-foreground">{customer.occupation}</p>
                <p className="text-sm text-muted-foreground">{customer.location}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Personal Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>Age:</span>
                <span>{customer.age}</span>
                <span>Retirement Year:</span>
                <span>{customer.retirementYear}</span>
                <span>Health Status:</span>
                <span>{customer.healthStatus}</span>
                <span>Risk Tolerance:</span>
                <span>{customer.riskTolerance}</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Family Information
              </h4>
              {customer.spouse ? (
                <div className="space-y-2">
                  <p className="text-sm">Spouse: {customer.spouse.name}</p>
                  <p className="text-sm">Spouse Age: {customer.spouse.age}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No spouse information</p>
              )}
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Estate Planning
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="will" />
                  <label htmlFor="will" className="text-sm">Has Will</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="trust" />
                  <label htmlFor="trust" className="text-sm">Has Trust</label>
                </div>
                <Input placeholder="Notes about estate planning" className="mt-2" />
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Home className="h-4 w-4" />
                Assets & Properties
              </h4>
              <div className="space-y-2">
                <p className="text-sm">Net Worth: ${customer.netWorth.toLocaleString()}</p>
                <Input placeholder="Add property details" className="mt-2" />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const ProductComparison = ({ products, providers }) => {
    if (!showProductComparison) return null;

    const selectedProviderProducts = Object.entries(insuranceProviders)
      .filter(([provider]) => providers.includes(provider))
      .reduce((acc, [provider, products]) => {
        Object.entries(products)
          .filter(([type]) => selectedProducts.includes(type))
          .forEach(([type, details]) => {
            acc.push({ provider, type, ...details });
          });
        return acc;
      }, []);

    return (
      <div className="mt-4 space-y-4">
        <h4 className="font-medium">Product Comparison</h4>
        <div className="grid grid-cols-1 gap-4">
          {selectedProviderProducts.map((product, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="font-medium">{product.name}</h5>
                  <p className="text-sm text-muted-foreground">{product.provider}</p>
                </div>
                <Badge>{product.riskLevel}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm">Target Age: {product.targetAge}</p>
                <p className="text-sm">Minimum Premium: ${product.minPremium.toLocaleString()}</p>
                <p className="text-sm">Returns: {product.returns}</p>
                <p className="text-sm">Fees: {product.fees}</p>
                <div className="mt-2">
                  <p className="text-sm font-medium">Key Features:</p>
                  <ul className="list-disc list-inside text-sm">
                    {product.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

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
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`} />
            <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{customer.name}</h3>
              <CustomerProfile customer={customer} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">Age: {customer.age}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                Retired: {customer.retirementYear}
              </span>
            </div>
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
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      <Select
                        onValueChange={(value) => setSelectedProviders(prev => 
                          prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value]
                        )}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select Provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(insuranceProviders).map(provider => (
                            <SelectItem key={provider} value={provider}>
                              {provider}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        onValueChange={(value) => setSelectedProducts(prev => 
                          prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value]
                        )}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select Product Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(new Set(
                            Object.values(insuranceProviders)
                              .flatMap(provider => Object.keys(provider))
                          )).map(productType => (
                            <SelectItem key={productType} value={productType}>
                              {productType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        onClick={() => setShowProductComparison(!showProductComparison)}
                      >
                        {showProductComparison ? 'Hide' : 'Show'} Comparison
                      </Button>
                    </div>

                    <ProductComparison
                      products={selectedProducts}
                      providers={selectedProviders}
                    />

                    <ScrollArea className="h-[300px]">
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