"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AnalyticsSection from "@/components/dashboards/superadmin/AnalyticsSection";
import ReportsAnalyticsSection from "@/components/dashboards/businessowner/ReportsAnalyticsSection";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [effectiveRole, setEffectiveRole] = useState(user?.roleName);

  useEffect(() => {
    const resolveRole = () => {
      if (!user) {
        setEffectiveRole(undefined);
        return;
      }

      try {
        const impersonationMode = typeof window !== "undefined" ? sessionStorage.getItem("impersonation_mode") : null;
        const impersonationUser = typeof window !== "undefined" ? sessionStorage.getItem("impersonation_user") : null;

        if (impersonationMode && impersonationUser) {
          const parsed = JSON.parse(impersonationUser);
          setEffectiveRole(parsed?.role || parsed?.roleName || user.roleName);
          return;
        }
      } catch (error) {
        console.error("Failed to resolve impersonation role:", error);
      }

      setEffectiveRole(user.roleName);
    };

    resolveRole();
  }, [user]);

  if (!effectiveRole) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (effectiveRole === "super_admin") {
    return <AnalyticsSection />;
  }

  if (effectiveRole === "business_owner") {
    return <ReportsAnalyticsSection />;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-900">Analytics Unavailable</h1>
      <p className="mt-2 text-sm text-gray-600">
        Detailed analytics are not configured for your role yet. Please contact an administrator for access.
      </p>
    </div>
  );
}
