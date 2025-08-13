
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/financas" element={<Financas />} />
          <Route path="/mercado" element={<Mercado />} />
          <Route path="/viagens" element={<Viagens />} />
          <Route path="/documentos" element={<Documentos />} />
          <Route path="/notas" element={<Notas />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
