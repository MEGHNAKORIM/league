import { useQuery } from '@tanstack/react-query';
import { authService } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Calendar } from 'lucide-react';
import { useLocation } from 'wouter';
import { format } from 'date-fns';
import { sports } from '@/lib/constants';
import api from '@/lib/api';
import type { Booking } from '@/types/schema';

export function ActiveBookingCard() {
  const [, setLocation] = useLocation();
  
  const { data: activeBooking, isLoading } = useQuery<Booking>({
    queryKey: ['/api/bookings/current'],
    queryFn: async () => {
      const response = await api.get<Booking>('/api/bookings/current/');
      return response.data;
    },
    enabled: authService.isAuthenticated(),
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Booking</h2>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getSportLabel = (sportValue: string) => {
    return sports.find(s => s.value === sportValue)?.label || sportValue;
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
      return `${date}, ${timeSlot}`; // Fallback to raw date
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Booking</h2>
      
      {activeBooking ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-success-50 rounded-xl flex items-center justify-center">
                  <Zap className="w-8 h-8 text-success" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {getSportLabel(activeBooking.sport)}
                  </h3>
                  <p className="text-gray-600">
                    {formatBookingDateTime(activeBooking.booking_date, activeBooking.time_slot)}
                  </p>
                  <Badge className="mt-2 bg-success-100 text-success-800 hover:bg-success-100">
                    Active
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Booking ID</p>
                <p className="font-mono text-sm">#{activeBooking.id.toString().padStart(3, '0')}</p>
              </div>
            </div>
            
            {activeBooking.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">{activeBooking.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
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
