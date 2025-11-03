"use client";

import { useState } from "react";
import ClientDashboard from '@/components/dashboards/client/ClientDashboard'
import BusinessOwnerDashboard from '@/components/dashboards/businessowner/BusinessOwnerDashboard'
import ProductionOwnerDashboard from '@/components/dashboards/productionowner/ProductionOwnerDashboard'
import SuperAdminDashboard from '@/components/dashboards/superadmin/SuperAdminDashboard'

// Mock user data - in production, this would come from auth context or API
const MOCK_USER = {
  name: "Sarah Mitchell",
  role: "client", // Change this to test different roles: "business_owner", "production_owner", "superadmin"
};

export default function DashboardPage() {
  const [user] = useState(MOCK_USER);

  // Render the appropriate dashboard based on user role
  const renderDashboardContent = () => {
    switch (user.role) {
      case "client":
        return <ClientDashboard userName={user.name} />;
      case "business_owner":
        return <BusinessOwnerDashboard userName={user.name} />;
      case "production_owner":
        return <ProductionOwnerDashboard userName={user.name} />;
      case "superadmin":
        return <SuperAdminDashboard userName={user.name} />;
      default:
        return <ClientDashboard userName={user.name} />;
    }
  };

  return renderDashboardContent();
}
