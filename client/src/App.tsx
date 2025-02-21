import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Register from "@/pages/Register";
import TeamPerformance from "@/pages/TeamPerformance";
import Associates from "@/pages/Associates";
import Business from "@/pages/Business";
import ProspectDashboard from "@/components/prospects/ProspectDashboard";
import { ProspectAnalytics } from "@/components/prospects/ProspectAnalytics";
import GoldenEra from "@/components/dashboard/GoldenEra";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/not-found";
import { FontPreview } from "@/components/dashboard/FontPreview";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/register" component={Register} />
        <Route path="/team-performance" component={TeamPerformance} />
        <Route path="/associates" component={Associates} />
        <Route path="/business" component={Business} />
        <Route path="/prospects" component={ProspectDashboard} />
        <Route path="/prospects/analytics" component={ProspectAnalytics} />
        <Route path="/golden-era" component={GoldenEra} />
        <Route path="/reports" component={Reports} />
        <Route path="/font-preview" component={FontPreview} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;