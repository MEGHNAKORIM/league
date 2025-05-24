import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { insertBookingSchema, type InsertBooking, type SportType } from '@/types/schema';
import api from '@/lib/api';
import { sports } from '@/lib/constants';
import { TimeslotSelector } from './TimeslotSelector';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

export function BookingForm() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const form = useForm<InsertBooking>({
    resolver: zodResolver(insertBookingSchema),
    defaultValues: {
      sport: 'badminton',
      booking_date: '',
      time_slot: '',
      notes: '',
    },
  });

  const watchedSport = form.watch('sport');
  const watchedDate = form.watch('booking_date');

  const createBookingMutation = useMutation({
    mutationFn: async (data: InsertBooking) => {
      const response = await api.post('/bookings/', {
        sport: data.sport,
        booking_date: data.booking_date,
        time_slot: data.time_slot,
        notes: data.notes || '',
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Booking created successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bookings/'] });
      queryClient.invalidateQueries({ queryKey: ['/api/bookings/my_booking/'] });
      setLocation('/');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create booking. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: InsertBooking) => {
    if (!selectedTimeSlot) {
      toast({
        title: 'Error',
        description: 'Please select a time slot',
        variant: 'destructive',
      });
      return;
    }
    
    createBookingMutation.mutate({
      ...data,
      time_slot: selectedTimeSlot,
    });
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    form.setValue('time_slot', timeSlot);
  };

  // Set date restrictions to only allow today and tomorrow
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const minDate = today.toISOString().split('T')[0];
  const maxDate = tomorrow.toISOString().split('T')[0];

  return (
    <Card>
      <CardContent className="p-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sport Selection */}
            <div className="space-y-2">
              <Label htmlFor="sport">Sport</Label>
              <Select 
                onValueChange={(value: SportType) => {
                  form.setValue('sport', value);
                  setSelectedTimeSlot(''); // Reset time slot when sport changes
                }}
                disabled={createBookingMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a sport" />
                </SelectTrigger>
                <SelectContent>
                  {sports.map((sport) => (
                    <SelectItem key={sport.value} value={sport.value}>
                      {sport.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.sport && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.sport.message}
                </p>
              )}
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label htmlFor="booking_date">Date</Label>
              <Input
                id="booking_date"
                type="date"
                min={minDate}
                max={maxDate}
                {...form.register('booking_date')}
                onChange={(e) => {
                  form.setValue('booking_date', e.target.value);
                  setSelectedTimeSlot(''); // Reset time slot when date changes
                }}
                disabled={createBookingMutation.isPending}
              />
              {form.formState.errors.booking_date && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.booking_date.message}
                </p>
              )}
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-2">
            <Label>Available Time Slots</Label>
            <TimeslotSelector
              sport={watchedSport}
              date={watchedDate}
              selectedTimeSlot={selectedTimeSlot}
              onSelectTimeSlot={handleTimeSlotSelect}
            />
            {form.formState.errors.time_slot && (
              <p className="text-sm text-destructive">
                {form.formState.errors.time_slot.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Any special requests or notes..."
              {...form.register('notes')}
              disabled={createBookingMutation.isPending}
            />
            {form.formState.errors.notes && (
              <p className="text-sm text-destructive">
                {form.formState.errors.notes.message}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setLocation('/')}
              disabled={createBookingMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createBookingMutation.isPending}
            >
              {createBookingMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner className="w-4 h-4" />
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Booking'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
