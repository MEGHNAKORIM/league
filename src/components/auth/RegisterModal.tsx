import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { insertUserSchema, type InsertUser, type BranchType, type CourseType } from '@/types/schema';
import { authService } from '@/lib/auth';
import api from '@/lib/api';
import { branches, courses } from '@/lib/constants';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

export function RegisterModal({ open, onOpenChange, onSwitchToLogin }: RegisterModalProps) {
  const { toast } = useToast();
  
  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: '',
      email: '',
      full_name: '',
      mobile: '',
      branch: 'CSE' as BranchType,
      course: 'BTECH' as CourseType,
      password: '',
      password2: '',
    },
  });

  const registerMutation = useMutation<{ refresh: string; access: string; user: any }, Error, InsertUser>({
    mutationFn: async (data: InsertUser) => {
      // Remove password2 from the request payload
      const { password2, ...requestData } = data;
      const response = await api.post<{ refresh: string; access: string; user: any }>('/auth/register/', requestData);
      return response.data;
    },
    onSuccess: (data: { refresh: string; access: string; user: any }) => {
      // Handle Django REST Framework JWT response
      authService.setAuth({ 
        token: data.access, 
        user: data.user
      });
      toast({
        title: 'Success',
        description: 'Account created successfully!',
      });
      onOpenChange(false);
      form.reset();
      window.location.reload(); // Force reload to update auth state
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.detail || 
                          Object.values(error.response?.data || {})[0] || 
                          error.message || 
                          'Registration failed. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: InsertUser) => {
    registerMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Create Account
          </DialogTitle>
          <p className="text-center text-gray-600">
            Join The League to start booking sports
          </p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...form.register('username')}
                disabled={registerMutation.isPending}
              />
              {form.formState.errors.username && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                {...form.register('full_name')}
                disabled={registerMutation.isPending}
              />
              {form.formState.errors.full_name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.full_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              disabled={registerMutation.isPending}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile</Label>
            <Input
              id="mobile"
              type="tel"
              {...form.register('mobile')}
              disabled={registerMutation.isPending}
            />
            {form.formState.errors.mobile && (
              <p className="text-sm text-destructive">
                {form.formState.errors.mobile.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Select onValueChange={(value: BranchType) => form.setValue('branch', value)} disabled={registerMutation.isPending}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.value} value={branch.value}>
                      {branch.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.branch && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.branch.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select onValueChange={(value: CourseType) => form.setValue('course', value)} disabled={registerMutation.isPending}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.value} value={course.value}>
                      {course.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.course && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.course.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...form.register('password')}
              disabled={registerMutation.isPending}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password2">Confirm Password</Label>
            <Input
              id="password2"
              type="password"
              {...form.register('password2')}
              disabled={registerMutation.isPending}
            />
            {form.formState.errors.password2 && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password2.message}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner className="w-4 h-4" />
                <span>Creating Account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto font-medium"
              onClick={onSwitchToLogin}
            >
              Sign in
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
