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
import { businessValueData } from '@/lib/mock-data';

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

const TeamPerformance = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

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

  const ComparisonView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Product Comparison</h3>
        <Button
          variant="outline"
          onClick={() => setShowComparison(false)}
        >
          Back to Products
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {/* Target Audience Comparison */}
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

        {/* Pros and Cons Comparison */}
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

        {/* Ideal Customer Profile */}
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
      </div>
    </div>
  );

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
              <ComparisonView />
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