import { useQuery } from '@tanstack/react-query';
import { authService } from '@/lib/auth';
import api from '@/lib/api';
import { HomePage } from './HomePage';
import { ActiveBookingCard } from '@/components/booking/ActiveBookingCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, Clock, Zap } from 'lucide-react';
import { useLocation } from 'wouter';
import { format } from 'date-fns';
import { sports, statusColors } from '@/lib/constants';
import type { Booking } from '@shared/schema';

export function Dashboard() {
  const [, setLocation] = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <HomePage />;
  }
  
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['/api/bookings/'],
    queryFn: async () => {
      const response = await api.get<Booking[] | { data: Booking[] }>('/bookings/');
      console.log('Raw API response:', response);
      console.log('Response data type:', typeof response.data);
      console.log('Response data:', response.data);
      // If response.data is already the array, use it directly
      return 'data' in response.data ? response.data.data : response.data;
    },
    enabled: authService.isAuthenticated(),
  });

  console.log('All bookings:', bookings);

  const getSportLabel = (sportValue: string) => {
    return sports.find(s => s.value === sportValue)?.label || sportValue;
  };

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'basketball':
        return <Zap className="w-5 h-5 text-primary" />;
      case 'tennis':
        return <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-xs">🎾</div>;
      case 'swimming':
        return <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs">🏊</div>;
      default:
        return <Calendar className="w-5 h-5 text-primary" />;
    }
  };

  // Calculate statistics
  const totalBookings = bookings?.length ?? 0;
  console.log('Total bookings:', totalBookings);

  const completedBookings = bookings?.filter((b) => {
    const isCompleted = b.status?.toUpperCase() === 'COMPLETED';
    console.log('Checking completed booking:', {
      status: b.status,
      upperStatus: b.status?.toUpperCase(),
      isCompleted
    });
    return isCompleted;
  }).length ?? 0;
  console.log('Completed bookings:', completedBookings);

  const upcomingBookings = bookings?.filter((b) => {
    const isConfirmed = b.status?.toUpperCase() === 'CONFIRMED';
    if (!isConfirmed) {
      console.log('Booking not confirmed:', {
        status: b.status,
        upperStatus: b.status?.toUpperCase()
      });
      return false;
    }

    const bookingDate = new Date(b.booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isUpcoming = bookingDate >= today;

    console.log('Checking upcoming booking:', {
      date: b.booking_date,
      bookingDate,
      today,
      isUpcoming
    });
    return isUpcoming;
  }).length ?? 0;
  console.log('Upcoming bookings:', upcomingBookings);

  console.log('Stats:', { totalBookings, completedBookings, upcomingBookings }); // Debug log

  // Get recent bookings (last 3)
  const recentBookings = bookings.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="hero-gradient rounded-xl p-8 mb-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to The League</h1>
          <p className="text-xl mb-6 text-blue-100">
            Book sports facilities, manage your reservations, and stay active on campus.
          </p>
          <Button 
            className="bg-white text-primary hover:bg-gray-50"
            onClick={() => setLocation('/book-sport')}
          >
            Book a Sport Now
          </Button>
        </div>
      </div>

      {/* Current Booking Card */}
      <ActiveBookingCard />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold text-foreground">{totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">{completedBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold text-foreground">{upcomingBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Recent Bookings</h3>
            <Button 
              variant="link" 
              className="p-0"
              onClick={() => setLocation('/bookings')}
            >
              View All
            </Button>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No bookings yet</p>
              <Button onClick={() => setLocation('/book-sport')}>
                Create Your First Booking
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentBookings.map((booking: Booking) => (
                <div key={booking.id} className="py-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        {getSportIcon(booking.sport)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {getSportLabel(booking.sport)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(booking.booking_date), 'MMM dd, yyyy')} • {booking.time_slot}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      className={statusColors[booking.status as keyof typeof statusColors]}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
