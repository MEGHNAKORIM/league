import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sportIcons } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Booking {
  id: number;
  sport: string;
  booking_date: string;
  time_slot: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
}

export function MyBookings() {
  const { data: bookings, isLoading, error } = useQuery<Booking[]>({
    queryKey: ['/bookings/my_booking'],
    queryFn: async () => {
      const response = await api.get<Booking[]>('/bookings/my_booking/');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load your bookings. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>You don't have any active bookings.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">My Bookings</h2>
      {bookings.map((booking: Booking) => (
        <Card key={booking.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>{sportIcons[booking.sport as keyof typeof sportIcons]}</span>
              <span className="capitalize">{booking.sport}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span>{booking.time_slot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="capitalize">{booking.status}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
