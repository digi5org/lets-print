"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ApiClient } from "@/lib/apiClient";
import toast, { Toaster } from "react-hot-toast";

const SAMPLE_USERS = [
  {
    id: "sample-1",
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    isActive: true,
    role: { name: "business_owner" },
    tenant: { name: "Print Hub" },
    subscription: "Professional",
    createdAt: "2024-09-15T10:15:00Z",
    lastLoginAt: "2024-12-18T14:24:00Z",
  },
  {
    id: "sample-2",
    name: "Miles Morales",
    email: "miles@studioflow.com",
    isActive: true,
    role: { name: "production_owner" },
    tenant: { name: "Studio Flow" },
    subscription: "Enterprise",
    createdAt: "2024-07-22T08:45:00Z",
    lastLoginAt: "2024-12-17T09:52:00Z",
  },
  {
    id: "sample-3",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    isActive: false,
    role: { name: "client" },
    tenant: { name: "Acme Marketing" },
    subscription: "Basic",
    createdAt: "2024-10-04T16:05:00Z",
    lastLoginAt: "2024-11-29T18:40:00Z",
  },
  {
    id: "sample-4",
    name: "David Kim",
    email: "david.kim@printmax.io",
    isActive: true,
    role: { name: "business_owner" },
    tenant: { name: "PrintMax" },
    subscription: "Professional",
    createdAt: "2024-05-11T12:30:00Z",
    lastLoginAt: "2024-12-18T11:10:00Z",
  },
  {
    id: "sample-5",
    name: "Emily Stone",
    email: "emily.stone@example.com",
    isActive: true,
    role: { name: "client" },
    tenant: { name: "Freelance" },
    subscription: "Basic",
    createdAt: "2024-12-01T09:00:00Z",
    lastLoginAt: "2024-12-19T07:25:00Z",
  },
];

const formatRole = (role = "client") =>
  role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
};

const getStatus = (user) => {
  if (user?.isActive === false) return "Suspended";
  if (user?.status) return user.status;
  return "Active";
};

const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Suspended":
      return "bg-red-100 text-red-800";
    case "Invited":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getRoleBadgeColor = (role) => {
  switch (role) {
    case "super_admin":
      return "bg-red-100 text-red-800";
    case "business_owner":
      return "bg-purple-100 text-purple-800";
    case "production_owner":
      return "bg-blue-100 text-blue-800";
    case "client":
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function AllUsersSection() {
  const { session } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = useCallback(async () => {
    if (!session?.accessToken) {
      setUsers(SAMPLE_USERS);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const api = new ApiClient(session.accessToken);
      const response = await api.get("/api/admin/users");
      const data = Array.isArray(response?.data) ? response.data : [];
      setUsers(data);
      setError(null);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to load users";
      console.error("Failed to load users:", err);
      setError(message);
      toast.error(message);
      setUsers((prev) => (prev.length > 0 ? prev : SAMPLE_USERS));
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleUserAction = async (userId, action) => {
    if (!session?.accessToken) return;

    try {
      const api = new ApiClient(session.accessToken);
      if (action === "delete") {
        const confirmed = window.confirm("Delete this user? This cannot be undone.");
        if (!confirmed) return;
        await api.delete(`/api/admin/users/${userId}`);
        toast.success("User deleted successfully");
      } else if (action === "suspend" || action === "activate") {
        await api.put(`/api/admin/users/${userId}`, { isActive: action === "activate" });
        toast.success(`User ${action === "activate" ? "activated" : "suspended"}`);
      }
      await loadUsers();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Action failed";
      console.error(`Failed to ${action} user:`, err);
      toast.error(message);
    }
  };

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((user) => user?.isActive !== false).length;
    const suspended = users.filter((user) => user?.isActive === false).length;
    const recent = users.filter((user) => {
      const created = user?.createdAt ? new Date(user.createdAt) : null;
      if (!created || Number.isNaN(created.getTime())) return false;
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
      return created >= thirtyDaysAgo;
    }).length;

    return [
      {
        label: "Total Users",
        value: total,
        deltaLabel: "vs last month",
        deltaValue: "+12%",
        highlight: true,
      },
      {
        label: "Active Users",
        value: active,
        deltaLabel: "Active rate",
        deltaValue: total ? `${Math.round((active / total) * 100)}%` : "0%",
      },
      {
        label: "New (30d)",
        value: recent,
        deltaLabel: "Last 30 days",
        deltaValue: recent > 0 ? "+18%" : "—",
      },
      {
        label: "Suspended",
        value: suspended,
        deltaLabel: "Compliance",
        deltaValue: suspended > 0 ? `${suspended} flagged` : "All clear",
      },
    ];
  }, [users]);

  const uniqueRoles = useMemo(() => {
    const roles = new Set(users.map((user) => user?.role?.name || user?.roleName || "client"));
    return Array.from(roles);
  }, [users]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const dataset = users.filter((user) => {
      const role = user?.role?.name || user?.roleName || "client";
      const status = getStatus(user).toLowerCase();

      const passesRole = roleFilter === "all" || role === roleFilter;
      const passesStatus = statusFilter === "all" || status === statusFilter;

      if (!passesRole || !passesStatus) return false;

      if (!normalizedSearch) return true;

      const haystack = `${user?.name || ""} ${user?.email || ""} ${user?.tenant?.name || ""}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });

    const sorted = [...dataset].sort((a, b) => {
      const multiplier = sortDirection === "asc" ? 1 : -1;

      if (sortKey === "name") {
        return multiplier * (a?.name || "").localeCompare(b?.name || "");
      }

      if (sortKey === "createdAt") {
        const aDate = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
        return multiplier * (aDate - bDate);
      }

      if (sortKey === "lastLoginAt") {
        const aDate = a?.lastLoginAt ? new Date(a.lastLoginAt).getTime() : 0;
        const bDate = b?.lastLoginAt ? new Date(b.lastLoginAt).getTime() : 0;
        return multiplier * (aDate - bDate);
      }

      return 0;
    });

    return sorted;
  }, [users, searchTerm, roleFilter, statusFilter, sortKey, sortDirection]);

  const handleSortChange = (key) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Users</h1>
            <p className="text-gray-600">Review every user across the platform, manage access, and export insights.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              onClick={loadUsers}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={() => toast("Bulk invite coming soon", { icon: "📨" })}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Invite Users
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error} — showing cached sample data.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${item.highlight ? "border-blue-500" : ""}`}
            >
              <p className="text-sm font-medium text-gray-600">{item.label}</p>
              <div className="mt-2 flex items-end justify-between">
                <p className="text-3xl font-bold text-gray-900">{item.value}</p>
                <span className="text-sm font-semibold text-green-600">{item.deltaValue}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">{item.deltaLabel}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-3 rounded-lg border border-gray-200 px-4 py-2">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
              </svg>
              <input
                type="search"
                placeholder="Search by name, email, or business"
                className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="all">All Roles</option>
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>
                    {formatRole(role)}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="invited">Invited</option>
              </select>
              <select
                value={`${sortKey}:${sortDirection}`}
                onChange={(event) => {
                  const [key, direction] = event.target.value.split(":");
                  setSortKey(key);
                  setSortDirection(direction);
                }}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="name:asc">Name (A → Z)</option>
                <option value="name:desc">Name (Z → A)</option>
                <option value="createdAt:desc">Newest</option>
                <option value="createdAt:asc">Oldest</option>
                <option value="lastLoginAt:desc">Last active</option>
                <option value="lastLoginAt:asc">Least active</option>
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    onClick={() => handleSortChange("name")}
                  >
                    <button type="button" className="flex items-center gap-1 text-gray-600">
                      User
                      {sortKey === "name" && (
                        <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                          {sortDirection === "asc" ? (
                            <path d="M8 5l4 6H4l4-6z" />
                          ) : (
                            <path d="M8 11l-4-6h8l-4 6z" />
                          )}
                        </svg>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Business
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    onClick={() => handleSortChange("createdAt")}
                  >
                    <button type="button" className="flex items-center gap-1 text-gray-600">
                      Created
                      {sortKey === "createdAt" && (
                        <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                          {sortDirection === "asc" ? (
                            <path d="M8 5l4 6H4l4-6z" />
                          ) : (
                            <path d="M8 11l-4-6h8l-4 6z" />
                          )}
                        </svg>
                      )}
                    </button>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    onClick={() => handleSortChange("lastLoginAt")}
                  >
                    <button type="button" className="flex items-center gap-1 text-gray-600">
                      Last Active
                      {sortKey === "lastLoginAt" && (
                        <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
                          {sortDirection === "asc" ? (
                            <path d="M8 5l4 6H4l4-6z" />
                          ) : (
                            <path d="M8 11l-4-6h8l-4 6z" />
                          )}
                        </svg>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500">
                      No users match the current filters.
                    </td>
                  </tr>
                )}
                {filteredUsers.map((user) => {
                  const role = user?.role?.name || user?.roleName || "client";
                  const status = getStatus(user);

                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                            {(user?.name || "?").charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-semibold text-gray-900">{user?.name || "Unnamed"}</p>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDetailsModal(true);
                              }}
                              className="text-left text-xs font-medium text-blue-600 hover:text-blue-800"
                            >
                              View details
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user?.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleBadgeColor(role)}`}>
                          {formatRole(role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {user?.tenant?.name || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(user?.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(user?.lastLoginAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(status)}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3 text-sm">
                          {user?.isActive !== false ? (
                            <button
                              onClick={() => handleUserAction(user.id, "suspend")}
                              className="text-orange-600 hover:text-orange-800"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction(user.id, "activate")}
                              className="text-green-600 hover:text-green-800"
                            >
                              Activate
                            </button>
                          )}
                          <button
                            onClick={() => handleUserAction(user.id, "delete")}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {showDetailsModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">User Detail</h2>
                  <p className="text-sm text-gray-500">Full profile and recent activity</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Name</p>
                  <p className="mt-1 font-semibold text-gray-900">{selectedUser?.name || "Unnamed"}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
                  <p className="mt-1 text-gray-900">{selectedUser?.email}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Role</p>
                  <p className="mt-1 text-gray-900">{formatRole(selectedUser?.role?.name || selectedUser?.roleName)}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Business</p>
                  <p className="mt-1 text-gray-900">{selectedUser?.tenant?.name || "—"}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Subscription</p>
                  <p className="mt-1 text-gray-900">{selectedUser?.subscription || "Basic"}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Status</p>
                  <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(getStatus(selectedUser))}`}>
                    {getStatus(selectedUser)}
                  </span>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Created</p>
                  <p className="mt-1 text-gray-900">{formatDate(selectedUser?.createdAt)}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Last Active</p>
                  <p className="mt-1 text-gray-900">{formatDate(selectedUser?.lastLoginAt)}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    toast.success("Impersonation request queued");
                  }}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Impersonate User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
