import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import MasterRegister from "@/pages/MasterRegister";
import MenuTree from "@/pages/MenuTree";
import Modules from "@/pages/Modules";
import Reports from "@/pages/Reports";
import TechnicalMapping from "@/pages/TechnicalMapping";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/master-register" element={<MasterRegister />} />
            <Route path="/menu-tree" element={<MenuTree />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/technical-mapping" element={<TechnicalMapping />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
