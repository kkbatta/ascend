import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Users, TrendingUp, BookOpen, Target,
  AlertCircle, ChevronRight, Award,
  Check, X
} from 'lucide-react';
import { BusinessValueChart } from '@/components/dashboard/BusinessValueChart';
import { businessValueData, prospects } from '@/lib/mock-data';

// Product performance data
const productData = [
  {
    month: 'Jan',
    'North American': 85000,
    'Athene': 65000,
    'Nationwide': 75000,
  },
  {
    month: 'Feb',
    'North American': 95000,
    'Athene': 78000,
    'Nationwide': 82000,
  },
  {
    month: 'Mar',
    'North American': 92000,
    'Athene': 71000,
    'Nationwide': 88000,
  }
];

const productDetails = {
  'SecureHorizon': {
    provider: 'North American',
    features: ['Guaranteed lifetime income', 'Market protection', 'Death benefit'],
    training: '/training/securehorizon',
    targetAudience: ['Retirees', 'High net worth individuals', 'Conservative investors'],
    pros: [
      'Strong guaranteed income options',
      'Principal protection',
      'Tax-deferred growth'
    ],
    cons: [
      'Higher fees compared to market alternatives',
      'Limited liquidity options',
      'Complex features may be overwhelming'
    ],
    idealFor: [
      'Age group: 55-75',
      'Income level: $100k+',
      'Risk tolerance: Conservative',
      'Financial goals: Retirement income, wealth preservation'
    ]
  },
  'Sunflower Annuity': {
    provider: 'Athene',
    features: ['Flexible premium options', 'Competitive rates', 'Multiple crediting strategies'],
    training: '/training/sunflower',
    targetAudience: ['Young professionals', 'Growing families', 'Mid-career individuals'],
    pros: [
      'Flexible contribution options',
      'Competitive interest rates',
      'Multiple investment choices'
    ],
    cons: [
      'Market volatility exposure',
      'Early withdrawal penalties',
      'Minimum investment requirements'
    ],
    idealFor: [
      'Age group: 35-50',
      'Income level: $75k-150k',
      'Risk tolerance: Moderate',
      'Financial goals: College savings, retirement planning'
    ]
  },
  'Prolife IUL': {
    provider: 'Nationwide',
    features: ['Living benefits', 'Cash value accumulation', 'Customizable coverage'],
    training: '/training/prolife',
    targetAudience: ['Business owners', 'Young families', 'Estate planners'],
    pros: [
      'Death benefit with living benefits',
      'Tax-advantaged growth potential',
      'Flexible premium payments'
    ],
    cons: [
      'Higher cost of insurance',
      'Complex product structure',
      'Requires active management'
    ],
    idealFor: [
      'Age group: 30-45',
      'Income level: $150k+',
      'Risk tolerance: Moderate to Aggressive',
      'Financial goals: Family protection, wealth transfer'
    ]
  }
};

// Placeholder for insurance provider data (replace with your actual data)
const insuranceProviders = {
  'North American': {
    'SecureHorizon': {
      name: 'SecureHorizon',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      minPremium: 10000,
      targetAge: '55+',
      riskLevel: 'Low',
      fees: '1%',
      returns: '3%'
    }
  },
  'Athene': {
    'Sunflower Annuity': {
      name: 'Sunflower Annuity',
      features: ['Feature A', 'Feature B', 'Feature C'],
      minPremium: 5000,
      targetAge: '35-50',
      riskLevel: 'Medium',
      fees: '0.75%',
      returns: '4%'
    }
  },
  'Nationwide': {
    'Prolife IUL': {
      name: 'Prolife IUL',
      features: ['Feature X', 'Feature Y', 'Feature Z'],
      minPremium: 15000,
      targetAge: '30-45',
      riskLevel: 'High',
      fees: '1.25%',
      returns: '5%'
    }
  }
};


const TeamPerformance = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<typeof prospects[0] | null>(null);

  const handleProductSelect = (productName: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productName)) {
        return prev.filter(p => p !== productName);
      }
      if (prev.length < 3) {
        return [...prev, productName];
      }
      return prev;
    });
  };

  const generateSellingPoints = (prospect: typeof prospects[0], products: string[]) => {
    const points: Record<string, string[]> = {};

    products.forEach(product => {
      const productInfo = productDetails[product as keyof typeof productDetails];
      const sellingPoints = [];

      // Enhanced Age-based recommendations
      if (prospect.age >= 55) {
        if (product === 'SecureHorizon') {
          sellingPoints.push(
            `With your ${prospect.age} years of experience, SecureHorizon's guaranteed income feature aligns perfectly with your retirement planning needs.`,
            `Our principal protection ensures your wealth is secure while maintaining growth potential.`,
            `You'll particularly appreciate our tax-deferred growth strategy which optimizes retirement income.`
          );
        } else if (product === 'Prolife IUL') {
          sellingPoints.push(
            `At ${prospect.age}, our living benefits feature provides both immediate protection and long-term value.`,
            `The flexibility in premium payments accommodates your established financial position.`
          );
        }
      } else if (prospect.age >= 35 && prospect.age < 55) {
        if (product === 'Sunflower Annuity') {
          sellingPoints.push(
            `At your career peak age of ${prospect.age}, Sunflower Annuity's flexible premium options maximize your earning potential.`,
            `Our competitive rates are designed to accelerate wealth accumulation during your prime earning years.`,
            `The multiple investment choices allow you to balance growth with security, perfect for your career stage.`
          );
        }
      }

      // Enhanced Income-based recommendations
      if (prospect.income >= 150000) {
        if (product === 'SecureHorizon') {
          sellingPoints.push(
            `Your income of $${prospect.income.toLocaleString()} positions you perfectly to maximize SecureHorizon's tax advantages.`,
            `Our premium structure is optimized for high-income professionals like yourself.`,
            `You can leverage our maximum contribution limits to optimize tax benefits.`
          );
        }
      } else if (prospect.income >= 75000) {
        if (product === 'Sunflower Annuity') {
          sellingPoints.push(
            `With your income of $${prospect.income.toLocaleString()}, our flexible contribution structure allows for strategic financial planning.`,
            `You can start building your retirement nest egg while maintaining financial flexibility.`,
            `Our competitive rates help maximize your investment potential within your income bracket.`
          );
        }
      }

      // Enhanced Family Status considerations
      if (prospect.familyStatus.toLowerCase().includes('kid') ||
        prospect.familyStatus.toLowerCase().includes('expecting')) {
        if (product === 'Prolife IUL') {
          sellingPoints.push(
            `As a family person with ${prospect.familyStatus}, our living benefits ensure comprehensive protection for your loved ones.`,
            `The flexible premium payments adapt to your growing family's changing needs.`,
            `Our death benefit with living benefits feature provides both immediate family protection and long-term financial security.`
          );
        } else if (product === 'Sunflower Annuity') {
          sellingPoints.push(
            `With your family status of ${prospect.familyStatus}, our education funding options provide excellent college planning opportunities.`,
            `The flexible premium structure accommodates changing family expenses.`
          );
        }
      }

      // Enhanced Risk Tolerance considerations
      if (prospect.riskTolerance.toLowerCase() === 'conservative') {
        if (product === 'SecureHorizon') {
          sellingPoints.push(
            `Your conservative investment approach aligns perfectly with our guaranteed minimum returns.`,
            `Our principal protection feature provides the security you prioritize.`,
            `The steady, predictable growth matches your risk comfort level.`
          );
        }
      } else if (prospect.riskTolerance.toLowerCase() === 'aggressive') {
        if (product === 'Prolife IUL') {
          sellingPoints.push(
            `For your aggressive risk profile, our variable investment options offer significant growth potential.`,
            `You can maximize market opportunities while maintaining a secure insurance foundation.`,
            `Our flexible investment strategies allow you to adjust risk exposure based on market conditions.`
          );
        }
      }

      // Enhanced Portfolio Alignment
      if (prospect.currentInvestments.some(inv =>
        inv.toLowerCase().includes('401k') ||
        inv.toLowerCase().includes('pension'))) {
        sellingPoints.push(
          `This product perfectly complements your existing ${prospect.currentInvestments.join(', ')} portfolio.`,
          `You'll benefit from additional tax advantages beyond your current retirement accounts.`,
          `Our features provide diversification benefits to your existing retirement strategy.`
        );
      }

      // Enhanced Occupation-specific recommendations
      if (prospect.occupation.toLowerCase().includes('business') ||
        prospect.occupation.toLowerCase().includes('entrepreneur')) {
        sellingPoints.push(
          `As a ${prospect.occupation}, you'll appreciate our flexible premium payment schedule that accommodates variable income streams.`,
          `This product can be integrated into your business succession planning strategy.`,
          `The tax advantages align well with business owner financial planning needs.`
        );
      }

      points[product] = sellingPoints;
    });

    return points;
  };

  const generateProductComparison = (selectedProducts: string[]) => {
    const comparisons: Record<string, any> = {};

    selectedProducts.forEach(product => {
      const [provider, type] = Object.entries(insuranceProviders).find(([_, products]) =>
        Object.keys(products).includes(product)
      ) || [];

      if (provider && type) {
        const productInfo = insuranceProviders[provider][type];
        comparisons[product] = {
          provider,
          name: productInfo.name,
          features: productInfo.features,
          minPremium: productInfo.minPremium,
          targetAge: productInfo.targetAge,
          riskLevel: productInfo.riskLevel,
          fees: productInfo.fees,
          returns: productInfo.returns
        };
      }
    });

    return comparisons;
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Team Performance</h1>
          <p className="text-gray-500">Track team metrics and product performance</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">Business Value Tracking</CardTitle>
                <p className="text-gray-500 text-sm">Track your progress towards annual target</p>
              </CardHeader>
              <CardContent>
                <BusinessValueChart data={businessValueData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            {showComparison ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Product Comparison</h3>
                  <div className="flex items-center gap-4">
                    <select
                      className="p-2 border rounded-lg"
                      onChange={(e) => setSelectedProspect(prospects.find(p => p.id === parseInt(e.target.value)) || null)}
                      value={selectedProspect?.id || ''}
                    >
                      <option value="">Select a prospect...</option>
                      {prospects.map(prospect => (
                        <option key={prospect.id} value={prospect.id}>
                          {prospect.name} - {prospect.occupation}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      onClick={() => setShowComparison(false)}
                    >
                      Back to Products
                    </Button>
                  </div>
                </div>

                {selectedProspect && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Prospect Profile Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Personal Information</h4>
                            <div className="space-y-2">
                              <p><span className="font-medium">Name:</span> {selectedProspect.name}</p>
                              <p><span className="font-medium">Age:</span> {selectedProspect.age}</p>
                              <p><span className="font-medium">Occupation:</span> {selectedProspect.occupation}</p>
                              <p><span className="font-medium">Family Status:</span> {selectedProspect.familyStatus}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Financial Profile</h4>
                            <div className="space-y-2">
                              <p><span className="font-medium">Income:</span> ${selectedProspect.income.toLocaleString()}</p>
                              <p><span className="font-medium">Risk Tolerance:</span> {selectedProspect.riskTolerance}</p>
                              <div>
                                <span className="font-medium">Current Investments:</span>
                                <ul className="list-disc ml-6 mt-1">
                                  {selectedProspect.currentInvestments.map((inv, idx) => (
                                    <li key={idx}>{inv}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Key Recommendations</h4>
                          <div className="space-y-2">
                            {selectedProspect.age >= 55 && (
                              <div className="flex items-start gap-2">
                                <Target className="w-5 h-5 text-blue-500 mt-1" />
                                <p>Focus on retirement income and wealth preservation strategies</p>
                              </div>
                            )}
                            {selectedProspect.income >= 150000 && (
                              <div className="flex items-start gap-2">
                                <Target className="w-5 h-5 text-green-500 mt-1" />
                                <p>Emphasize tax-advantaged investment options</p>
                              </div>
                            )}
                            {selectedProspect.riskTolerance.toLowerCase() === 'conservative' && (
                              <div className="flex items-start gap-2">
                                <Target className="w-5 h-5 text-yellow-500 mt-1" />
                                <p>Highlight guaranteed income features and principal protection</p>
                              </div>
                            )}
                            {selectedProspect.familyStatus.toLowerCase().includes('kid') && (
                              <div className="flex items-start gap-2">
                                <Target className="w-5 h-5 text-purple-500 mt-1" />
                                <p>Focus on family protection and education planning</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Target Audience Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedProducts.map(product => (
                          <div key={product} className="space-y-4">
                            <h4 className="font-bold text-lg">{product}</h4>
                            <div className="space-y-2">
                              {productDetails[product as keyof typeof productDetails].targetAudience.map((audience, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <ChevronRight size={16} className="text-blue-500" />
                                  <span>{audience}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Pros & Cons Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedProducts.map(product => (
                          <div key={product} className="space-y-4">
                            <h4 className="font-bold text-lg">{product}</h4>
                            <div>
                              <h5 className="font-semibold text-green-600 mb-2">Pros</h5>
                              <div className="space-y-2">
                                {productDetails[product as keyof typeof productDetails].pros.map((pro, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <Check size={16} className="text-green-500" />
                                    <span>{pro}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className="font-semibold text-red-600 mb-2">Cons</h5>
                              <div className="space-y-2">
                                {productDetails[product as keyof typeof productDetails].cons.map((con, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <X size={16} className="text-red-500" />
                                    <span>{con}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Ideal Customer Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedProducts.map(product => (
                          <div key={product} className="space-y-4">
                            <h4 className="font-bold text-lg">{product}</h4>
                            <div className="space-y-2">
                              {productDetails[product as keyof typeof productDetails].idealFor.map((ideal, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <Target size={16} className="text-purple-500" />
                                  <span>{ideal}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {selectedProspect && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Personalized Selling Points</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          {selectedProducts.map(product => {
                            const sellingPoints = generateSellingPoints(selectedProspect, [product])[product];
                            return (
                              <div key={product} className="space-y-4">
                                <h4 className="font-bold text-lg">{product}</h4>
                                <div className="space-y-2">
                                  {sellingPoints.map((point, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                      <div className="mt-1">
                                        <Target size={16} className="text-blue-500" />
                                      </div>
                                      <p className="text-sm">{point}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-sm text-gray-500">
                    Select up to 3 products to compare
                  </p>
                  <Button
                    onClick={() => setShowComparison(true)}
                    disabled={selectedProducts.length < 2}
                  >
                    Compare Selected ({selectedProducts.length})
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(productDetails).map(([product, details]) => (
                    <Card key={product} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={selectedProducts.includes(product)}
                              onCheckedChange={() => handleProductSelect(product)}
                            />
                            <h3 className="font-bold text-lg">{product}</h3>
                          </div>
                          <Badge>{details.provider}</Badge>
                        </div>
                        <div className="space-y-2">
                          {details.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <ChevronRight size={16} className="text-blue-500" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <a
                          href={details.training}
                          className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        >
                          <BookOpen size={16} />
                          <span>Training Materials</span>
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="training">
            <Card>
              <CardHeader>
                <CardTitle>Training Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-blue-50">
                        <BookOpen className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Product Training</h3>
                        <p className="text-sm text-gray-500">Learn about our insurance products</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-purple-50">
                        <Users className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Team Building</h3>
                        <p className="text-sm text-gray-500">Leadership and management skills</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeamPerformance;