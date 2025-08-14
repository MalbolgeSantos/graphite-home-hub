
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { HouseholdProvider } from "@/hooks/useHousehold";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Financas from "./pages/Financas";
import Mercado from "./pages/Mercado";
import Viagens from "./pages/Viagens";
import Documentos from "./pages/Documentos";
import Notas from "./pages/Notas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <HouseholdProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/financas" element={<ProtectedRoute><Financas /></ProtectedRoute>} />
              <Route path="/mercado" element={<ProtectedRoute><Mercado /></ProtectedRoute>} />
              <Route path="/viagens" element={<ProtectedRoute><Viagens /></ProtectedRoute>} />
              <Route path="/documentos" element={<ProtectedRoute><Documentos /></ProtectedRoute>} />
              <Route path="/notas" element={<ProtectedRoute><Notas /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HouseholdProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
