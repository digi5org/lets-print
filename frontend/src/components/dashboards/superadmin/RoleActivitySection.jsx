"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { ApiClient } from "@/lib/apiClient";

export default function RoleActivitySection() {
  const { data: session } = useSession();
  const [roles, setRoles] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("all");

  const loadData = useCallback(async () => {
    if (!session?.accessToken) return;
    try {
      const api = new ApiClient(session.accessToken);
      const [rolesRes, activitiesRes] = await Promise.all([
        api.get("/api/admin/roles"),
        api.get("/api/admin/activities?limit=50"),
      ]);
      setRoles(rolesRes.data || []);
      setActivities(activitiesRes.data || []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const mockActivities = [
    { id: 1, user: "John Smith", role: "client", action: "Placed new order", time: "2 min ago", ip: "192.168.1.1" },
    { id: 2, user: "Jane Doe", role: "business_owner", action: "Updated product pricing", time: "5 min ago", ip: "192.168.1.2" },
    { id: 3, user: "Mike Wilson", role: "production_owner", action: "Completed order #1234", time: "10 min ago", ip: "192.168.1.3" },
    { id: 4, user: "Admin User", role: "super_admin", action: "Created new user", time: "15 min ago", ip: "192.168.1.4" },
    { id: 5, user: "Sarah Johnson", role: "client", action: "Uploaded design file", time: "20 min ago", ip: "192.168.1.5" },
    { id: 6, user: "Bob Brown", role: "business_owner", action: "Generated report", time: "30 min ago", ip: "192.168.1.6" },
  ];

  const roleStats = [
    { name: "Super Admin", role: "super_admin", activeUsers: 2, totalActions: 156, color: "purple" },
    { name: "Business Owner", role: "business_owner", activeUsers: 15, totalActions: 1250, color: "blue" },
    { name: "Production Owner", role: "production_owner", activeUsers: 8, totalActions: 890, color: "green" },
    { name: "Client", role: "client", activeUsers: 125, totalActions: 4520, color: "gray" },
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-100 text-purple-800";
      case "business_owner":
        return "bg-blue-100 text-blue-800";
      case "production_owner":
        return "bg-green-100 text-green-800";
      case "client":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatRole = (role) =>
    role
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const displayActivities = activities.length > 0 ? activities : mockActivities;

  const filteredActivities =
    selectedRole === "all"
      ? displayActivities
      : displayActivities.filter((a) => a.role === selectedRole);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Role Activity</h1>
        <p className="text-gray-600 mt-1">Monitor user activities across different roles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roleStats.map((stat) => (
          <div
            key={stat.role}
            className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${
              stat.color === "purple"
                ? "border-purple-500"
                : stat.color === "blue"
                ? "border-blue-500"
                : stat.color === "green"
                ? "border-green-500"
                : "border-gray-500"
            } cursor-pointer hover:shadow-md transition-shadow`}
            onClick={() => setSelectedRole(stat.role)}
          >
            <p className="text-sm text-gray-600">{stat.name}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.activeUsers} active</p>
            <p className="text-xs text-gray-500 mt-2">{stat.totalActions} actions today</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Role:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="business_owner">Business Owner</option>
            <option value="production_owner">Production Owner</option>
            <option value="client">Client</option>
          </select>
          <button className="ml-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            Export Activity
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {activity.user?.charAt(0) || "S"}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activity.user || activity.actor}</p>
                  <p className="text-sm text-gray-600">{activity.action || activity.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(activity.role)}`}>
                  {formatRole(activity.role || "system")}
                </span>
                <span className="text-sm text-gray-500">{activity.ip || "-"}</span>
                <span className="text-sm text-gray-500">{activity.time || new Date(activity.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Role Permissions Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-500">Permission</th>
                <th className="text-center py-3 text-sm font-medium text-purple-600">Super Admin</th>
                <th className="text-center py-3 text-sm font-medium text-blue-600">Business Owner</th>
                <th className="text-center py-3 text-sm font-medium text-green-600">Production Owner</th>
                <th className="text-center py-3 text-sm font-medium text-gray-600">Client</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {["User Management", "Order Management", "Product Management", "Analytics", "Billing", "Settings"].map(
                (perm) => (
                  <tr key={perm}>
                    <td className="py-3 text-gray-900">{perm}</td>
                    <td className="py-3 text-center">
                      <span className="text-green-500">✓</span>
                    </td>
                    <td className="py-3 text-center">
                      <span className="text-green-500">✓</span>
                    </td>
                    <td className="py-3 text-center">
                      {perm === "Order Management" || perm === "Product Management" ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-red-500">✗</span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {perm === "Order Management" ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-red-500">✗</span>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
