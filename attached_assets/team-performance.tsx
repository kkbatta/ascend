import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { 
  Users, TrendingUp, BookOpen, Target,
  AlertCircle, ChevronRight, Award
} from 'lucide-react';

const TeamPerformance = () => {
  // Your existing TeamPerformance component code here
  const [selectedProduct, setSelectedProduct] = useState(null);
  
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

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Team Performance & Products</h1>
        <p className="text-gray-500">Insurance product analysis and team metrics</p>
      </div>

      {/* Product Performance Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Insurance Product Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="North American" fill="#6366F1" />
                <Bar dataKey="Athene" fill="#8B5CF6" />
                <Bar dataKey="Nationwide" fill="#EC4899" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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

      {/* Additional Charts & Metrics */}
      {/* Add your business value tracking and team activity components here */}
    </div>
  );
};

export default TeamPerformance;