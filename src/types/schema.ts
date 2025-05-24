import { z } from 'zod';

export type BranchType = 'CSE' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL';
export type CourseType = 'BTECH' | 'MTECH' | 'PHD';
export type SportType = 'badminton' | 'squash' | 'football' | 'basketball' | 'cricket';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export const BRANCH_CHOICES = [
  { value: 'CSE', label: 'Computer Science' },
  { value: 'ECE', label: 'Electronics & Communication' },
  { value: 'EEE', label: 'Electrical & Electronics' },
  { value: 'MECH', label: 'Mechanical' },
  { value: 'CIVIL', label: 'Civil' },
] as const;

export const COURSE_CHOICES = [
  { value: 'BTECH', label: 'B.Tech' },
  { value: 'MTECH', label: 'M.Tech' },
  { value: 'PHD', label: 'Ph.D' },
] as const;

export const SPORT_CHOICES = [
  { value: 'badminton', label: 'Badminton' },
  { value: 'squash', label: 'Squash' },
  { value: 'football', label: 'Football' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'cricket', label: 'Cricket' },
] as const;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const insertUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  full_name: z.string().min(3),
  mobile: z.string().min(10),
  branch: z.enum(['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL']),
  course: z.enum(['BTECH', 'MTECH', 'PHD']),
  password: z.string().min(6),
  password2: z.string().min(6),
}).refine((data) => data.password === data.password2, {
  message: "Passwords don't match",
  path: ["password2"],
});

export const insertBookingSchema = z.object({
  sport: z.enum(['badminton', 'squash', 'football', 'basketball', 'cricket']),
  booking_date: z.string(),
  time_slot: z.string(),
  notes: z.string().optional(),
});

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  mobile: string;
  branch: BranchType;
  course: CourseType;
}

export interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  sport: SportType;
  is_available: boolean;
}

export interface Booking {
  id: number;
  sport: SportType;
  booking_date: string;
  time_slot: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type LoginData = z.infer<typeof loginSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
