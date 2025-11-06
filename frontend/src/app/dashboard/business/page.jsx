"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import BusinessOwnerDashboard from "@/components/dashboards/businessowner/BusinessOwnerDashboard";

export default function BusinessDashboardPage() {
  const { user, isLoading } = useAuth();
  const [displayName, setDisplayName] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check if we're in impersonation mode
    const impersonationUser = sessionStorage.getItem('impersonation_user');
    
    if (impersonationUser) {
      try {
        const impUser = JSON.parse(impersonationUser);
        setDisplayName(impUser.name || impUser.email);
      } catch (e) {
        console.error('Failed to parse impersonation user:', e);
        setDisplayName(user?.name);
      }
    } else {
      setDisplayName(user?.name);
    }
  }, [user, mounted]);

  if (isLoading || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <BusinessOwnerDashboard userName={displayName} />;
}
