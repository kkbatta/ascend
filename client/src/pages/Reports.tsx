import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProviderMetricsReport } from '@/components/reports/ProviderMetricsReport';
import { OrgRevenueReport } from '@/components/reports/OrgRevenueReport';
import { ScrollArea } from "@/components/ui/scroll-area";
import { LightbulbIcon } from 'lucide-react';

const Reports = () => {
  // Mock AI suggestions based on the data
  const aiSuggestions = [
    {
      id: 1,
      title: "Revenue Optimization",
      description: "North American's IUL products show strong performance. Consider increasing focus on IUL training for your team.",
      action: "Schedule IUL training session",
      priority: "High"
    },
    {
      id: 2,
      title: "Team Performance",
      description: "Base Shop conversion rates are below target. Implement weekly sales strategy sessions.",
      action: "Set up weekly strategy meetings",
      priority: "Medium"
    },
    {
      id: 3,
      title: "Product Mix",
      description: "Fixed Annuity sales are trending down. Review current rates and marketing materials.",
      action: "Update marketing collateral",
      priority: "Medium"
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6">Reports</h1>
          <Tabs defaultValue="provider-metrics" className="space-y-6">
            <TabsList>
              <TabsTrigger value="provider-metrics">Provider Metrics</TabsTrigger>
              <TabsTrigger value="org-revenue">Organization Revenue</TabsTrigger>
            </TabsList>
            <TabsContent value="provider-metrics">
              <ProviderMetricsReport />
            </TabsContent>
            <TabsContent value="org-revenue">
              <OrgRevenueReport />
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Suggestions Box */}
        <div className="w-80">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LightbulbIcon className="w-5 h-5 text-yellow-500" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {aiSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">{suggestion.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                      <div className="flex justify-between items-center">
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          {suggestion.action} →
                        </button>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          suggestion.priority === 'High' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {suggestion.priority} Priority
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;