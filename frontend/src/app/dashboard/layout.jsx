"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardLayoutWrapper({ children }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [effectiveRole, setEffectiveRole] = useState(null);
  const [effectiveName, setEffectiveName] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Mark component as mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    // Only run on client side after mounting
    if (!mounted) return;

    // Check if we're in impersonation mode first
    const impersonationMode = sessionStorage.getItem('impersonation_mode');
    const impersonationUser = sessionStorage.getItem('impersonation_user');
    
    if (impersonationMode && impersonationUser) {
      // Use impersonated user's role
      try {
        const impUser = JSON.parse(impersonationUser);
        setEffectiveRole(impUser.role);
        setEffectiveName(impUser.name || impUser.email);
      } catch (e) {
        console.error('Failed to parse impersonation user:', e);
        // Fallback to actual user if available
        if (user) {
          setEffectiveRole(user.roleName);
          setEffectiveName(user.name);
        }
      }
    } else if (user) {
      // Use actual user's role
      setEffectiveRole(user.roleName);
      setEffectiveName(user.name);
    }
  }, [user, mounted, pathname]); // Added pathname to re-check when route changes

  // Show loading only when actually loading auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If we have a user but no effective role yet, show loading for a moment
  if (!user) {
    return null;
  }

  if (!effectiveRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Map Auth.js role names to original UI role names
  const roleMapping = {
    'super_admin': 'superadmin',
    'business_owner': 'business_owner',
    'production_owner': 'production_owner',
    'client': 'client'
  };

  const uiRole = roleMapping[effectiveRole] || 'client';

  return (
    <DashboardLayout userRole={uiRole} userName={effectiveName}>
      {children}
    </DashboardLayout>
  );
}
