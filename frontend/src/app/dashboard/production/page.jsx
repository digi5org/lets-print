"use client";

import { useAuth } from "@/contexts/AuthContext";
import ProductionOwnerDashboard from "@/components/dashboards/ProductionOwnerDashboard";

export default function ProductionDashboardPage() {
  const { user } = useAuth();

  return <ProductionOwnerDashboard userName={user?.name} />;
}
