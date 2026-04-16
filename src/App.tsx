import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import InstallPage from "./pages/InstallPage";
import Portfolio from "./pages/Portfolio";
import NotFound from "./pages/NotFound";
import CloudSyncDemo from "./pages/demos/CloudSyncDemo";
import FinTrackDemo from "./pages/demos/FinTrackDemo";
import PenTestDemo from "./pages/demos/PenTestDemo";
import PhishGuardDemo from "./pages/demos/PhishGuardDemo";
import NetSentinelDemo from "./pages/demos/NetSentinelDemo";
import VaultKeeperDemo from "./pages/demos/VaultKeeperDemo";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Portfolio />} />
    <Route path="/trading" element={<Index />} />
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/install" element={<InstallPage />} />
    <Route path="/demo/cloudsync" element={<CloudSyncDemo />} />
    <Route path="/demo/fintrack" element={<FinTrackDemo />} />
    <Route path="/demo/pentest" element={<PenTestDemo />} />
    <Route path="/demo/phishguard" element={<PhishGuardDemo />} />
    <Route path="/demo/netsentinel" element={<NetSentinelDemo />} />
    <Route path="/demo/vaultkeeper" element={<VaultKeeperDemo />} />
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } 
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
