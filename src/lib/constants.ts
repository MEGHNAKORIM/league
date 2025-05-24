import { SPORT_CHOICES, BRANCH_CHOICES, COURSE_CHOICES } from "@/types/schema";

export const sports = SPORT_CHOICES;
export const branches = BRANCH_CHOICES;
export const courses = COURSE_CHOICES;

export const statusColors = {
  active: 'bg-orange-100 text-orange-800',
  completed: 'bg-success-100 text-success-800',
  cancelled: 'bg-red-100 text-red-800',
} as const;

export const sportIcons = {
  basketball: '🏀',
  squash: '🎾',
  cricket: '🏏',
  football: '⚽',
  badminton: '🏸',
} as const;
