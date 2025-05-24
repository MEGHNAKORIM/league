import { ProfileView } from '@/components/profile/ProfileView';

export function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account information and preferences.</p>
      </div>

      <ProfileView />
    </div>
  );
}
