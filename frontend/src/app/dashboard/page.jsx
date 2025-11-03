"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect to role-specific dashboard
      const roleMapping = {
        'super_admin': '/dashboard/admin',
        'business_owner': '/dashboard/business',
        'production_owner': '/dashboard/production',
        'client': '/dashboard/client'
      };

      const targetRoute = roleMapping[user.roleName] || '/dashboard/client';
      router.replace(targetRoute);
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
