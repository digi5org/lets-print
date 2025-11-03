"use client";

import { useAuth } from "@/contexts/AuthContext";
import BusinessOwnerDashboard from "@/components/dashboards/BusinessOwnerDashboard";

export default function BusinessDashboardPage() {
  const { user } = useAuth();

  return <BusinessOwnerDashboard userName={user?.name} />;
}
