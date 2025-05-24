import { SPORT_CHOICES, BRANCH_CHOICES, COURSE_CHOICES } from "@/types/schema";

export const sports = SPORT_CHOICES;
export const branches = BRANCH_CHOICES;
export const courses = COURSE_CHOICES;

export const statusColors = {
  PENDING: 'bg-orange-100 text-orange-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-success-100 text-success-800',
  CANCELLED: 'bg-red-100 text-red-800',
} as const;

export const sportIcons = {
  basketball: '🏀',
  squash: '🎾',
  cricket: '🏏',
  football: '⚽',
  badminton: '🏸',
} as const;
