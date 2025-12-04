"use client";

import { useAuth } from "@/contexts/AuthContext";
import SuperAdminDashboard from "@/components/dashboards/superadmin/SuperAdminDashboard";

export default function AdminDashboardPage() {
  const { session } = useAuth();

  return <SuperAdminDashboard userName={session?.user?.name} />;
}
