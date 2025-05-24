import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/lib/auth';
import { apiRequest } from '@/lib/queryClient';
import { branches, courses } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

export function ProfileView() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const user = authService.getUser();

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('DELETE', '/api/users/delete_account/');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Account Deleted',
        description: 'Your account has been successfully deleted.',
      });
      authService.clearAuth();
      setLocation('/');
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete account. Please try again.',
        variant: 'destructive',
      });
    },
  });

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getBranchLabel = (branchValue: string) => {
    return branches.find(b => b.value === branchValue)?.label || branchValue;
  };

  const getCourseLabel = (courseValue: string) => {
    return courses.find(c => c.value === courseValue)?.label || courseValue;
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardContent className="p-8">
          <div className="flex items-start space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                {getInitials(user.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.full_name}</h2>
              <p className="text-gray-600 mb-4">{user.email}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Personal Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Username:</span>
                      <span className="text-sm text-gray-900 ml-2">{user.username}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Mobile:</span>
                      <span className="text-sm text-gray-900 ml-2">{user.mobile}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Academic Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Branch:</span>
                      <span className="text-sm text-gray-900 ml-2">{getBranchLabel(user.branch)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Course:</span>
                      <span className="text-sm text-gray-900 ml-2">{getCourseLabel(user.course)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardContent className="p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
          
          <div className="space-y-4">
            <Button className="w-full md:w-auto">
              Edit Profile
            </Button>
            
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-base font-medium text-gray-900 mb-2">Danger Zone</h4>
              <p className="text-sm text-gray-600 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete your account? This action cannot be undone 
                      and you will lose all your booking history.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteAccountMutation.mutate()}
                      disabled={deleteAccountMutation.isPending}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleteAccountMutation.isPending ? 'Deleting...' : 'Delete Account'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
