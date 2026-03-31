import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import MedicalChatbot from "@/components/MedicalChatbot";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import UploadPage from "@/pages/UploadPage";
import Dashboard from "@/pages/Dashboard";
import HistoryPage from "@/pages/HistoryPage";
import NotFound from "@/pages/NotFound";
import { type User, mockLogout } from "@/lib/medicalEngine";

const queryClient = new QueryClient();

function ProtectedRoute({ user, children }: { user: User | null; children: React.ReactNode }) {
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => {
    mockLogout();
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar user={user} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login onAuth={setUser} />} />
            <Route path="/signup" element={<Signup onAuth={setUser} />} />
            <Route path="/upload" element={<ProtectedRoute user={user}><UploadPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute user={user}><HistoryPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MedicalChatbot />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
