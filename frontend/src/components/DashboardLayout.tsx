'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role }) => {
  const { user } = useAuth();

  const getRoleName = (role: UserRole) => {
    switch (role) {
      case UserRole.CLIENT:
        return 'Client';
      case UserRole.STARTUP_OWNER:
        return 'Startup Owner';
      case UserRole.PRODUCTION_OWNER:
        return 'Production Owner';
      case UserRole.SUPER_ADMIN:
        return 'Super Admin';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {getRoleName(role)} Dashboard
          </h1>
          {user && (
            <p className="text-gray-600 mt-2">
              Welcome back, {user.firstName}!
            </p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
