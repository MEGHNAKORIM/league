import { useQuery } from '@tanstack/react-query';
import { authService } from '@/lib/auth';
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
  
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['/api/bookings/'],
    enabled: authService.isAuthenticated(),
  });

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
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter((b: Booking) => b.status === 'completed').length;
  const upcomingBookings = bookings.filter((b: Booking) => b.status === 'active').length;

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
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
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
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No bookings yet</p>
              <Button onClick={() => setLocation('/book-sport')}>
                Create Your First Booking
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentBookings.map((booking: Booking) => (
                <div key={booking.id} className="py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        {getSportIcon(booking.sport)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {getSportLabel(booking.sport)}
                        </p>
                        <p className="text-sm text-gray-600">
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
