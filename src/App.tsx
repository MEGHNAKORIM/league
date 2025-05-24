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
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-8">
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
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
