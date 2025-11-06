"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BusinessLayout({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [effectiveRole, setEffectiveRole] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check if we're in impersonation mode
    const impersonationMode = sessionStorage.getItem('impersonation_mode');
    const impersonationUser = sessionStorage.getItem('impersonation_user');
    
    let role = user?.roleName;
    
    if (impersonationMode && impersonationUser) {
      try {
        const impUser = JSON.parse(impersonationUser);
        role = impUser.role;
      } catch (e) {
        console.error('Failed to parse impersonation user:', e);
      }
    }
    
    setEffectiveRole(role);

    // Redirect if not business owner (and not loading)
    if (!isLoading && user && role && role !== "business_owner") {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router, mounted]);

  if (isLoading || !mounted || !effectiveRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (effectiveRole !== "business_owner") {
    return null;
  }

  return <>{children}</>;
}
