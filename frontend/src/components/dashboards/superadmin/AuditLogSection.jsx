"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { ApiClient } from "@/lib/apiClient";

export default function AuditLogSection() {
  const { data: session } = useSession();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: "all",
    user: "",
    dateFrom: "",
    dateTo: "",
  });

  const loadLogs = useCallback(async () => {
    if (!session?.accessToken) return;
    try {
      const api = new ApiClient(session.accessToken);
      const response = await api.get("/api/admin/activities?limit=100");
      setLogs(response.data || []);
    } catch (error) {
      console.error("Failed to load logs:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const mockLogs = [
    { id: 1, action: "user_login", user: "John Smith", role: "client", ip: "192.168.1.100", details: "Successful login", timestamp: "2024-12-02 14:30:25" },
    { id: 2, action: "order_created", user: "Jane Doe", role: "business_owner", ip: "192.168.1.101", details: "Order #1234 created", timestamp: "2024-12-02 14:28:12" },
    { id: 3, action: "user_updated", user: "Admin User", role: "super_admin", ip: "192.168.1.1", details: "Updated user permissions for Mike Wilson", timestamp: "2024-12-02 14:25:00" },
    { id: 4, action: "product_updated", user: "Bob Brown", role: "business_owner", ip: "192.168.1.102", details: "Updated product pricing", timestamp: "2024-12-02 14:20:45" },
    { id: 5, action: "design_uploaded", user: "Sarah Johnson", role: "client", ip: "192.168.1.103", details: "Uploaded design file design_v2.pdf", timestamp: "2024-12-02 14:15:30" },
    { id: 6, action: "order_completed", user: "Mike Wilson", role: "production_owner", ip: "192.168.1.104", details: "Order #1230 marked as completed", timestamp: "2024-12-02 14:10:00" },
    { id: 7, action: "user_login_failed", user: "Unknown", role: "-", ip: "203.0.113.50", details: "Failed login attempt for admin@example.com", timestamp: "2024-12-02 14:05:22" },
    { id: 8, action: "settings_changed", user: "Admin User", role: "super_admin", ip: "192.168.1.1", details: "Updated system settings", timestamp: "2024-12-02 13:55:10" },
    { id: 9, action: "user_created", user: "Admin User", role: "super_admin", ip: "192.168.1.1", details: "Created new user: Lisa Taylor", timestamp: "2024-12-02 13:50:00" },
    { id: 10, action: "subscription_changed", user: "System", role: "system", ip: "-", details: "Subscription renewed for Acme Corp", timestamp: "2024-12-02 13:45:00" },
  ];

  const actionTypes = [
    { value: "all", label: "All Actions" },
    { value: "user_login", label: "User Login" },
    { value: "user_login_failed", label: "Failed Login" },
    { value: "user_created", label: "User Created" },
    { value: "user_updated", label: "User Updated" },
    { value: "order_created", label: "Order Created" },
    { value: "order_completed", label: "Order Completed" },
    { value: "product_updated", label: "Product Updated" },
    { value: "settings_changed", label: "Settings Changed" },
  ];

  const getActionColor = (action) => {
    if (action.includes("failed") || action.includes("error")) return "bg-red-100 text-red-800";
    if (action.includes("login")) return "bg-blue-100 text-blue-800";
    if (action.includes("created")) return "bg-green-100 text-green-800";
    if (action.includes("updated") || action.includes("changed")) return "bg-yellow-100 text-yellow-800";
    if (action.includes("deleted")) return "bg-red-100 text-red-800";
    if (action.includes("completed")) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  const formatAction = (action) =>
    action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const displayLogs = logs.length > 0 ? logs : mockLogs;

  const filteredLogs = displayLogs.filter((log) => {
    if (filters.action !== "all" && log.action !== filters.action) return false;
    if (filters.user && !log.user.toLowerCase().includes(filters.user.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
          <p className="text-gray-600 mt-1">Track all system activities and user actions</p>
        </div>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Logs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total Events</p>
          <p className="text-2xl font-bold text-gray-900">{displayLogs.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Successful Logins</p>
          <p className="text-2xl font-bold text-green-600">
            {displayLogs.filter((log) => log.action === "user_login").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Failed Logins</p>
          <p className="text-2xl font-bold text-red-600">
            {displayLogs.filter((log) => log.action === "user_login_failed").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Admin Actions</p>
          <p className="text-2xl font-bold text-purple-600">
            {displayLogs.filter((log) => log.role === "super_admin").length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {actionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search by user..."
            value={filters.user}
            onChange={(e) => setFilters({ ...filters, user: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setFilters({ action: "all", user: "", dateFrom: "", dateTo: "" })}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                  {log.timestamp || new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionColor(log.action)}`}>
                    {formatAction(log.action)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{log.user || log.entityName || "System"}</td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">{log.role?.replace("_", " ") || "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-600 font-mono">{log.ip || "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{log.details || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredLogs.length} of {displayLogs.length} entries
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">Previous</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
          <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
          <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>
  );
}
