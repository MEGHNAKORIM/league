import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { authService } from "@/lib/auth";
import { Dashboard } from "@/pages/Dashboard";
import { BookingPage } from "@/pages/BookingPage";
import { BookingsListPage } from "@/pages/BookingsListPage";
import { ProfilePage } from "@/pages/ProfilePage";
import NotFound from "@/pages/not-found";

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!authService.isAuthenticated()) {
    return <Redirect to="/" />;
  }
  return <>{children}</>;
}

function Router() {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/book-sport">
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        </Route>
        <Route path="/bookings">
          <ProtectedRoute>
            <BookingsListPage />
          </ProtectedRoute>
        </Route>
        <Route path="/profile">
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
