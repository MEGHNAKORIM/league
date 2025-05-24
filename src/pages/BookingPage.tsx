import { BookingForm } from '@/components/booking/BookingForm';

export function BookingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Book a Sport</h1>
        <p className="text-gray-600">Reserve your spot for sports activities on campus.</p>
      </div>

      <BookingForm />
    </div>
  );
}
