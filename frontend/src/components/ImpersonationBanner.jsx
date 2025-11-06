"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ImpersonationBanner() {
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [originalUser, setOriginalUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check if we're in impersonation mode
    const checkImpersonation = () => {
      const impersonationMode = sessionStorage.getItem('impersonation_mode');
      const originalAdminData = sessionStorage.getItem('original_admin');
      
      if (impersonationMode && originalAdminData) {
        setIsImpersonating(true);
        try {
          setOriginalUser(JSON.parse(originalAdminData));
        } catch (e) {
          console.error('Failed to parse original admin data:', e);
        }
      } else {
        setIsImpersonating(false);
        setOriginalUser(null);
      }
    };

    checkImpersonation();

    // Check periodically in case it changes
    const interval = setInterval(checkImpersonation, 1000);
    
    return () => clearInterval(interval);
  }, [mounted]);

  const exitImpersonation = () => {
    // Clear impersonation data
    sessionStorage.removeItem('impersonation_token');
    sessionStorage.removeItem('impersonation_mode');
    sessionStorage.removeItem('impersonation_user');
    sessionStorage.removeItem('original_admin');
    
    setIsImpersonating(false);
    toast.success('Exited impersonation mode');
    
    // Use Next.js router instead of window.location for smoother navigation
    setTimeout(() => {
      router.push('/dashboard/admin');
    }, 300);
  };

  if (!isImpersonating) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3 shadow-lg border-b-2 border-purple-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            <span className="font-semibold">READ-ONLY MODE</span>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <span>•</span>
            <span>Logged in as Business Owner</span>
            {originalUser && (
              <>
                <span>•</span>
                <span className="text-purple-200">
                  Super Admin: {originalUser.email}
                </span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={exitImpersonation}
          className="px-4 py-1.5 bg-white text-purple-700 text-sm font-medium rounded-md hover:bg-purple-50 transition-colors flex items-center space-x-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Exit & Return to Admin</span>
        </button>
      </div>
    </div>
  );
}
