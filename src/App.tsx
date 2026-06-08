import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Index from "./pages/Index";
import Aurora from "./pages/Aurora";
import NotFound from "./pages/NotFound";
import Projects from "./components/Projects";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShaderCursor from "@/components/ShaderCursor";
import GrainOverlay from "@/components/GrainOverlay";
import { useLenis } from "@/hooks/use-lenis";

const queryClient = new QueryClient();

function AppInner() {
  useLenis();

  return (
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <GrainOverlay />
        <ShaderCursor />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/aurora" element={<Aurora />} />
            <Route
              path="/projects"
              element={
                <>
                  <Header />
                  <Projects />
                  <Footer />
                </>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppInner />
  </QueryClientProvider>
);

export default App;
