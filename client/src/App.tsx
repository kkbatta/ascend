import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Dashboard from "@/pages/Dashboard";
import AuthPage from "@/pages/auth-page";
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
        <Route path="/auth" component={AuthPage} />
        <ProtectedRoute path="/" component={Dashboard} />
        <ProtectedRoute path="/register" component={Register} />
        <ProtectedRoute path="/team-performance" component={TeamPerformance} />
        <ProtectedRoute path="/associates" component={Associates} />
        <ProtectedRoute path="/business" component={Business} />
        <ProtectedRoute path="/prospects" component={ProspectDashboard} />
        <ProtectedRoute path="/prospects/analytics" component={ProspectAnalytics} />
        <ProtectedRoute path="/golden-era" component={GoldenEra} />
        <ProtectedRoute path="/reports" component={Reports} />
        <ProtectedRoute path="/font-preview" component={FontPreview} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;