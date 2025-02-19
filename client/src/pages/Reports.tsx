import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProviderMetricsReport } from '@/components/reports/ProviderMetricsReport';
import { OrgRevenueReport } from '@/components/reports/OrgRevenueReport';

const Reports = () => {
  return (
    <div className="container mx-auto p-6">
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
  );
};

export default Reports;