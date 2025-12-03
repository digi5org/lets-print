"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { ApiClient } from "@/lib/apiClient";
import toast, { Toaster } from "react-hot-toast";

export default function UserAccessSection() {
  const { data: session } = useSession();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const loadData = useCallback(async () => {
    if (!session?.accessToken) return;
    try {
      const api = new ApiClient(session.accessToken);
      const rolesRes = await api.get("/api/admin/roles");
      setRoles(rolesRes.data || []);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const defaultRoles = [
    {
      id: 1,
      name: "super_admin",
      description: "Full system access",
      usersCount: 2,
      permissions: ["all"],
    },
    {
      id: 2,
      name: "business_owner",
      description: "Business management access",
      usersCount: 15,
      permissions: ["orders", "products", "analytics", "billing"],
    },
    {
      id: 3,
      name: "production_owner",
      description: "Production management access",
      usersCount: 8,
      permissions: ["orders", "production", "inventory"],
    },
    {
      id: 4,
      name: "client",
      description: "Customer access",
      usersCount: 125,
      permissions: ["orders", "designs", "invoices"],
    },
  ];

  const allPermissions = [
    { id: "orders", name: "Orders", description: "View and manage orders" },
    { id: "products", name: "Products", description: "Manage products and pricing" },
    { id: "users", name: "Users", description: "User management" },
    { id: "analytics", name: "Analytics", description: "View reports and analytics" },
    { id: "billing", name: "Billing", description: "Billing and subscriptions" },
    { id: "production", name: "Production", description: "Production management" },
    { id: "inventory", name: "Inventory", description: "Inventory management" },
    { id: "designs", name: "Designs", description: "Design library access" },
    { id: "invoices", name: "Invoices", description: "Invoice management" },
    { id: "settings", name: "Settings", description: "System settings" },
  ];

  const displayRoles = roles.length > 0 ? roles : defaultRoles;

  const formatRole = (role) =>
    role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Access</h1>
            <p className="text-gray-600 mt-1">Manage roles and permissions</p>
          </div>
          <button
            onClick={() => {
              setSelectedRole(null);
              setShowModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Role
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayRoles.map((role) => (
            <div key={role.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{formatRole(role.name)}</h3>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {role.usersCount || role._count?.users || 0} users
                </span>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Permissions:</p>
                <div className="flex flex-wrap gap-2">
                  {(role.permissions || []).map((perm, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedRole(role);
                    setShowModal(true);
                  }}
                  className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm"
                >
                  Edit Permissions
                </button>
                {role.name !== "super_admin" && (
                  <button className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm">Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Permissions Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-4 text-sm font-medium text-gray-500">Permission</th>
                  {displayRoles.map((role) => (
                    <th key={role.id} className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                      {formatRole(role.name)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allPermissions.map((perm) => (
                  <tr key={perm.id}>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-gray-900">{perm.name}</p>
                      <p className="text-xs text-gray-500">{perm.description}</p>
                    </td>
                    {displayRoles.map((role) => (
                      <td key={role.id} className="text-center py-3 px-4">
                        <input
                          type="checkbox"
                          checked={
                            role.permissions?.includes("all") ||
                            role.permissions?.includes(perm.id)
                          }
                          onChange={() => {}}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {selectedRole ? `Edit ${formatRole(selectedRole.name)}` : "Add New Role"}
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role Name *</label>
                  <input
                    type="text"
                    defaultValue={selectedRole?.name || ""}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., custom_role"
                    disabled={selectedRole?.name === "super_admin"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    defaultValue={selectedRole?.description || ""}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Role description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {allPermissions.map((perm) => (
                      <label key={perm.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          defaultChecked={
                            selectedRole?.permissions?.includes("all") ||
                            selectedRole?.permissions?.includes(perm.id)
                          }
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{perm.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {selectedRole ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
