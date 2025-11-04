"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardLayoutWrapper({ children }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Map Auth.js role names to original UI role names
  const roleMapping = {
    'super_admin': 'superadmin',
    'business_owner': 'business_owner',
    'production_owner': 'production_owner',
    'client': 'client'
  };

  const uiRole = roleMapping[user.roleName] || 'client';

  return (
    <DashboardLayout userRole={uiRole} userName={user.name}>
      {children}
    </DashboardLayout>
  );
}
