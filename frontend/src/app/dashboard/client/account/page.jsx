"use client";

import MyAccountSection from "@/components/dashboards/client/MyAccountSection";

const accountProfile = {
  name: "Jamie Summers",
  email: "jamie.summers@example.com",
  company: "Tech Solutions Inc.",
  tenant: "tech-solutions",
  billing: {
    defaultMethod: "Corporate card ending 4428",
    recipient: "accounts-payable@example.com",
    frequency: "Monthly",
  },
  preferences: {
    requireApproval: true,
  },
  security: {
    lastLogin: "Dec 10, 2024 at 08:42 AM",
    mfaEnabled: true,
    allowedIps: ["192.168.0.12", "192.168.0.13"],
    sessionDuration: "7 days",
  },
};

export default function MyAccountPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your profile, security settings, and preferences</p>
        </div>
      </div>

      <MyAccountSection profile={accountProfile} />
    </div>
  );
}
