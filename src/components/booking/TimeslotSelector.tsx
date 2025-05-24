import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import api from '@/lib/api';

interface TimeSlotResponse {
  available_slots: string[];
}

interface TimeslotSelectorProps {
  sport: string;
  date: string;
  selectedTimeSlot: string;
  onSelectTimeSlot: (timeSlot: string) => void;
}

export function TimeslotSelector({ 
  sport, 
  date, 
  selectedTimeSlot, 
  onSelectTimeSlot 
}: TimeslotSelectorProps) {
  const { data, isLoading, error } = useQuery<TimeSlotResponse>({
    queryKey: ['/api/bookings/available_timeslots', { sport, date }],
    queryFn: async () => {
      const response = await api.get<TimeSlotResponse>(`/bookings/available_timeslots/?sport=${sport}&date=${date}`);
      return response.data;
    },
    enabled: !!(sport && date),
  });

  if (!sport || !date) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Select a sport and date to view available time slots</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
        <span className="ml-2 text-gray-600">Loading available slots...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-gray-600">Failed to load time slots. Please try again.</p>
      </div>
    );
  }

  let availableSlots = data?.available_slots || [];

  // Filter out past time slots if the selected date is today
  const now = new Date();
  const selectedDate = new Date(date);
  
  if (selectedDate.toDateString() === now.toDateString()) {
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    
    availableSlots = availableSlots.filter(slot => {
      const [hours, minutes] = slot.split(':').map(Number);
      if (hours < currentHour) return false;
      if (hours === currentHour && minutes <= currentMinutes) return false;
      return true;
    });
  }

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No available time slots for the selected sport and date.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {availableSlots.map((slot: string) => (
        <Button
          key={slot}
          type="button"
          variant={selectedTimeSlot === slot ? "default" : "outline"}
          className={`p-3 text-sm font-medium transition-colors ${
            selectedTimeSlot === slot
              ? 'bg-primary text-primary-foreground'
              : 'hover:border-primary hover:bg-primary/5'
          }`}
          onClick={() => onSelectTimeSlot(slot)}
        >
          {slot}
        </Button>
      ))}
    </div>
  );
}
