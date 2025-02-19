import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Business = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Business Overview</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Business management content will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Business;
