import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authService } from '@/lib/auth';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { sports, statusColors } from '@/lib/constants';
import type { Booking } from '@shared/schema';

export function BookingList() {
  const [sportFilter, setSportFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFromFilter, setDateFromFilter] = useState<string>('');
  const [dateToFilter, setDateToFilter] = useState<string>('');

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['/api/bookings/'],
    queryFn: async () => {
      const response = await api.get<Booking[]>('/bookings/');
      return response.data;
    },
    enabled: authService.isAuthenticated(),
  });

  const getSportLabel = (sportValue: string) => {
    return sports.find(s => s.value === sportValue)?.label || sportValue;
  };

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'basketball':
        return <Zap className="w-6 h-6 text-primary" />;
      case 'tennis':
        return <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">🎾</div>;
      case 'swimming':
        return <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">🏊</div>;
      default:
        return <Calendar className="w-6 h-6 text-primary" />;
    }
  };

  const filteredBookings = bookings.filter((booking: Booking) => {
    if (sportFilter !== 'all' && booking.sport !== sportFilter) return false;
    if (statusFilter !== 'all' && booking.status !== statusFilter) return false;
    if (dateFromFilter && booking.booking_date < dateFromFilter) return false;
    if (dateToFilter && booking.booking_date > dateToFilter) return false;
    return true;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filter-sport">Sport</Label>
              <Select onValueChange={setSportFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sports" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  {sports.map((sport) => (
                    <SelectItem key={sport.value} value={sport.value}>
                      {sport.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-status">Status</Label>
              <Select onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="CONFIRMED">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-date-from">From Date</Label>
              <Input
                id="filter-date-from"
                type="date"
                value={dateFromFilter}
                onChange={(e) => setDateFromFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-date-to">To Date</Label>
              <Input
                id="filter-date-to"
                type="date"
                value={dateToFilter}
                onChange={(e) => setDateToFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No bookings found.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredBookings.map((booking: Booking) => (
                <div key={booking.id} className="py-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        {getSportIcon(booking.sport)}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {getSportLabel(booking.sport)}
                        </h4>
                        <p className="text-gray-600">
                          {format(new Date(booking.booking_date), 'MMMM dd, yyyy')} • {booking.time_slot}
                        </p>
                        {booking.notes && (
                          <p className="text-sm text-gray-500 mt-1">{booking.notes}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Booked on {format(new Date(booking.created_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        className={`mb-2 ${statusColors[booking.status as keyof typeof statusColors]}`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                      <p className="text-sm text-gray-500">
                        ID: <span className="font-mono">#{booking.id.toString().padStart(3, '0')}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
