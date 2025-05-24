import { BookingList } from '@/components/booking/BookingList';

export function BookingsListPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Bookings</h1>
        <p className="text-gray-600">View and manage all your sports bookings.</p>
      </div>

      <BookingList />
    </div>
  );
}
