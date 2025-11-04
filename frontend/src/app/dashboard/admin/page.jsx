"use client";

import { useAuth } from "@/contexts/AuthContext";
import SuperAdminDashboard from "@/components/dashboards/superadmin/SuperAdminDashboard";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return <SuperAdminDashboard userName={user?.name} />;
}
