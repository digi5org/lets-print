"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Only redirect if we're exactly at /dashboard and haven't redirected yet
    if (!isLoading && user && pathname === '/dashboard' && !hasRedirectedRef.current) {
      // Mark as redirected immediately to prevent loops
      hasRedirectedRef.current = true;
      
      // Check if we're in impersonation mode
      const impersonationMode = sessionStorage.getItem('impersonation_mode');
      const impersonationUser = sessionStorage.getItem('impersonation_user');
      
      let targetRole = user.roleName;
      
      // If impersonating, use the impersonated user's role
      if (impersonationMode && impersonationUser) {
        try {
          const impUser = JSON.parse(impersonationUser);
          targetRole = impUser.role;
        } catch (e) {
          console.error('Failed to parse impersonation user:', e);
        }
      }
      
      // Redirect to role-specific dashboard
      const roleMapping = {
        'super_admin': '/dashboard/admin',
        'business_owner': '/dashboard/business',
        'production_owner': '/dashboard/production',
        'client': '/dashboard/client'
      };

      const targetRoute = roleMapping[targetRole] || '/dashboard/client';
      
      // Use replace to avoid adding to history
      router.replace(targetRoute);
    }
  }, [user, isLoading, pathname, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
