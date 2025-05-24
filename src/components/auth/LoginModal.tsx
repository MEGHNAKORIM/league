
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { loginSchema, type LoginData, type User } from '@/types/schema';
import { authService } from '@/lib/auth';
import api from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToRegister: () => void;
}

export function LoginModal({ open, onOpenChange, onSwitchToRegister }: LoginModalProps) {
  const { toast } = useToast();
  
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation<{ refresh: string; access: string; user: User }, Error, LoginData>({
    mutationFn: async (data: LoginData) => {
      const response = await api.post<{ refresh: string; access: string; user: User }>('/auth/login/', data);
      return response.data;
    },
    onSuccess: (data: { refresh: string; access: string; user: User }) => {
      // Handle Django REST Framework JWT response
      authService.setAuth({ 
        token: data.access, 
        user: data.user,
      });
      toast({
        title: 'Success',
        description: 'Logged in successfully!',
      });
      onOpenChange(false);
      form.reset();
      window.location.reload(); // Force reload to update auth state
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.detail || 
                          Object.values(error.response?.data || {})[0] || 
                          error.message || 
                          'Login failed. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Welcome Back
          </DialogTitle>
          <p className="text-center text-gray-600">
            Sign in to your account to continue
          </p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              disabled={loginMutation.isPending}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...form.register('password')}
              disabled={loginMutation.isPending}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button type="button" variant="link" className="p-0 h-auto">
              Forgot password?
            </Button>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner className="w-4 h-4" />
                <span>Signing In...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto font-medium"
              onClick={onSwitchToRegister}
            >
              Sign up
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
