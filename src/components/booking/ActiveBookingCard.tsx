import { useQuery } from '@tanstack/react-query';
import { authService } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { useLocation } from 'wouter';
import { format } from 'date-fns';
import { sports, statusColors, sportIcons } from '@/lib/constants';
import api from '@/lib/api';
import type { Booking } from '@/types/schema';

export function ActiveBookingCard() {
  const [, setLocation] = useLocation();
  
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['/api/bookings/'],
    queryFn: async () => {
      const response = await api.get<Booking[]>('/bookings/');
      return response.data;
    },
    enabled: authService.isAuthenticated(),
  });

  // Filter bookings for today
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  const todaysBookings = bookings.filter(booking => 
    booking.booking_date === todayString && 
    booking.status === 'CONFIRMED'
  );

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Today's Bookings</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getSportLabel = (sportValue: string) => {
    return sports.find(s => s.value === sportValue)?.label || sportValue;
  };

  const getSportIcon = (sport: string) => {
    return sportIcons[sport as keyof typeof sportIcons] || '🏃';
  };

  const formatBookingDateTime = (date: string, timeSlot: string) => {
    try {
      // Parse the date string in ISO format (YYYY-MM-DD)
      const [year, month, day] = date.split('-').map(Number);
      const bookingDate = new Date(year, month - 1, day); // month is 0-indexed in JS
      
      if (isNaN(bookingDate.getTime())) {
        throw new Error('Invalid date');
      }

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      let dateLabel;
      if (bookingDate.toDateString() === today.toDateString()) {
        dateLabel = 'Today';
      } else if (bookingDate.toDateString() === tomorrow.toDateString()) {
        dateLabel = 'Tomorrow';
      } else {
        dateLabel = format(bookingDate, 'MMM dd, yyyy');
      }

      return `${dateLabel}, ${timeSlot}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">Today's Bookings</h2>
        <Button onClick={() => setLocation('/book-sport')}>
          Book a Sport
        </Button>
      </div>
      
      {todaysBookings.length > 0 ? (
        <div className="space-y-4">
          {todaysBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    {getSportIcon(booking.sport)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">
                        {getSportLabel(booking.sport)}
                      </h3>
                      <Badge 
                        className={statusColors[booking.status as keyof typeof statusColors]}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">
                      {format(new Date(booking.booking_date), 'MMMM dd, yyyy')} • {booking.time_slot}
                    </p>
                    {booking.notes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {booking.notes}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Booking</h3>
            <p className="text-gray-600 mb-4">You don't have any active bookings at the moment.</p>
            <Button onClick={() => setLocation('/book-sport')}>
              Book a Sport
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
