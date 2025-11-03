"use client";

import { useAuth } from "@/contexts/AuthContext";
import ClientDashboard from "@/components/dashboards/client/ClientDashboard";

export default function ClientDashboardPage() {
  const { user } = useAuth();

  return <ClientDashboard userName={user?.name} />;
}
