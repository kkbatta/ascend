import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, TrendingUp, BookOpen, Target,
  AlertCircle, ChevronRight, Award
} from 'lucide-react';
import { BusinessValueChart } from '@/components/dashboard/BusinessValueChart';
import { businessValueData } from '@/lib/mock-data';

// Product performance data from team-performance.tsx
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
    training: '/training/securehorizon'
  },
  'Sunflower Annuity': {
    provider: 'Athene',
    features: ['Flexible premium options', 'Competitive rates', 'Multiple crediting strategies'],
    training: '/training/sunflower'
  },
  'Prolife IUL': {
    provider: 'Nationwide',
    features: ['Living benefits', 'Cash value accumulation', 'Customizable coverage'],
    training: '/training/prolife'
  }
};

const TeamPerformance = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

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
            {/* Business Value Tracking */}
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
            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(productDetails).map(([product, details]) => (
                <Card key={product} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg">{product}</h3>
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
          </TabsContent>

          <TabsContent value="training">
            {/* Training Content */}
            <Card>
              <CardHeader>
                <CardTitle>Training Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {/* Training content from team-performance-training.tsx */}
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
