"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ApiClient } from "@/lib/apiClient";

export default function SuperAdminDashboard({ userName }) {
  const { session } = useAuth();
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
    tenantId: "",
  });
  const [tenantFormData, setTenantFormData] = useState({
    name: "",
    slug: "",
    domain: "",
  });

  // Load data from backend API
  const loadData = useCallback(async () => {
    if (!session?.accessToken) return;
    
    try {
      const api = new ApiClient(session.accessToken);
      const [usersData, rolesData, tenantsData] = await Promise.all([
        api.get("/api/admin/users"),
        api.get("/api/admin/roles"),
        api.get("/api/admin/tenants"),
      ]);
      
      console.log('=== API Response Debug ===');
      console.log('Users response:', usersData);
      console.log('Roles response:', rolesData);
      console.log('Tenants response:', tenantsData);
      console.log('Tenants array:', tenantsData.data);
      console.log('Tenants count:', tenantsData.data?.length);
      console.log('========================');
      
      setUsers(usersData.data || []);
      setRoles(rolesData.data || []);
      setTenants(tenantsData.data || []);
      
      console.log('State after setting:', {
        usersCount: usersData.data?.length,
        rolesCount: rolesData.data?.length,
        tenantsCount: tenantsData.data?.length
      });
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate stats from real data
  const stats = [
    { name: "Total Users", value: users.length.toString(), change: "+28", changeType: "positive" },
    { name: "Active Businesses", value: tenants.length.toString(), change: "+5", changeType: "positive" },
    { name: "Production Facilities", value: "8", change: "+1", changeType: "positive" },
    { name: "Monthly Revenue", value: "$45,230", change: "+22%", changeType: "positive" },
  ];

  const systemStats = [
    { name: "Server Uptime", value: "99.8%", status: "Excellent" },
    { name: "API Response Time", value: "124ms", status: "Good" },
    { name: "Storage Used", value: "342 GB / 1 TB", status: "Normal" },
    { name: "Active Sessions", value: "156", status: "Normal" },
  ];

  const subscriptionPlans = [
    { 
      name: "Basic",
      price: "$29/month",
      users: 45,
      features: ["Up to 50 orders/month", "Basic support", "2 users"],
      color: "blue"
    },
    { 
      name: "Professional",
      price: "$99/month",
      users: 28,
      features: ["Unlimited orders", "Priority support", "10 users", "CRM tools"],
      color: "purple"
    },
    { 
      name: "Enterprise",
      price: "$299/month",
      users: 12,
      features: ["Unlimited everything", "24/7 support", "Unlimited users", "Custom features"],
      color: "green"
    },
  ];

  const recentActivity = [
    { id: 1, action: "New user registration", user: "Alice Brown", time: "5 minutes ago", type: "user" },
    { id: 2, action: "Subscription upgraded", user: "PrintHub Co", time: "1 hour ago", type: "subscription" },
    { id: 3, action: "System backup completed", user: "System", time: "2 hours ago", type: "system" },
    { id: 4, action: "User suspended", user: "Robert Wilson", time: "3 hours ago", type: "user" },
    { id: 5, action: "New business registered", user: "FastPrint Ltd", time: "5 hours ago", type: "business" },
  ];

  const handleUserAction = async (userId, action) => {
    if (!session?.accessToken) return;
    
    try {
      const api = new ApiClient(session.accessToken);
      
      if (action === 'suspend' || action === 'activate') {
        const isActive = action === 'activate';
        await api.put(`/api/admin/users/${userId}`, { isActive });
        await loadData(); // Reload data
      } else if (action === 'delete') {
        if (confirm('Are you sure you want to delete this user?')) {
          await api.delete(`/api/admin/users/${userId}`);
          await loadData(); // Reload data
        }
      }
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      alert(`Failed to ${action} user: ${error.message}`);
    }
  };

  const handleSubscriptionChange = () => {
    // Subscription management would be handled by a payment provider
    console.log("Changing subscription for user:", selectedUser);
    setShowSubscriptionModal(false);
    setSelectedUser(null);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!session?.accessToken) return;

    try {
      const api = new ApiClient(session.accessToken);
      const role = roles.find(r => r.id === formData.roleId);
      
      await api.post("/api/admin/users", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        roleName: role?.name,
        tenantId: formData.tenantId || undefined,
      });

      setShowUserModal(false);
      setFormData({ name: "", email: "", password: "", roleId: "", tenantId: "" });
      alert('User created successfully!');
      await loadData(); // Reload users
    } catch (error) {
      console.error("Failed to create user:", error);
      alert(`Failed to create user: ${error.message}`);
    }
  };

  const handleCreateTenant = async (e) => {
    e.preventDefault();
    if (!session?.accessToken) return;

    try {
      const api = new ApiClient(session.accessToken);
      const response = await api.post("/api/admin/tenants", tenantFormData);
      
      console.log('Tenant created successfully:', response);
      setShowTenantModal(false);
      setTenantFormData({ name: "", slug: "", domain: "" });
      alert('Business/Tenant created successfully!');
      await loadData(); // Reload tenants
    } catch (error) {
      console.error("Failed to create tenant:", error);
      alert(`Failed to create tenant: ${error.message}`);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "client":
      case "Client":
        return "bg-blue-100 text-blue-800";
      case "business_owner":
      case "Business Owner":
        return "bg-purple-100 text-purple-800";
      case "production_owner":
      case "Production Owner":
        return "bg-green-100 text-green-800";
      case "super_admin":
      case "SuperAdmin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Suspended":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "user":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case "subscription":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case "system":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        );
      case "business":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SuperAdmin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {userName}! Manage your entire system from here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <span
                className={`text-sm font-medium ${
                  stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-600"> this month</span>
            </div>
          </div>
        ))}
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemStats.map((stat) => (
            <div key={stat.name} className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                stat.status === "Excellent" 
                  ? "bg-green-100 text-green-800" 
                  : stat.status === "Good"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {stat.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button 
            onClick={() => setShowUserModal(true)}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add User
          </button>
          <button 
            onClick={() => setShowTenantModal(true)}
            className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Add Business
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            System Backup
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate Report
          </button>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              Filter by Role
            </button>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role?.name || 'Client')}`}>
                      {user.role?.name || 'Client'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.tenant?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <button 
                      onClick={() => {
                        setSelectedUser(user);
                        setShowSubscriptionModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {user.subscription || 'Basic'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.isActive ? 'Active' : 'Suspended')}`}>
                      {user.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {user.isActive ? (
                      <button 
                        onClick={() => handleUserAction(user.id, 'suspend')}
                        className="text-orange-600 hover:text-orange-800 font-medium"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleUserAction(user.id, 'activate')}
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        Activate
                      </button>
                    )}
                    <button 
                      onClick={() => handleUserAction(user.id, 'delete')}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tenant/Business Management */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">Business/Tenant Management</h2>
            <span className="text-sm text-gray-500">({tenants.length} total)</span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => loadData()}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
              title="Refresh data"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button 
              onClick={() => setShowTenantModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Business
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <div className="text-gray-500 mb-2">
                      No businesses/tenants found. Click &quot;Add Business&quot; to create one.
                    </div>
                    <div className="text-xs text-gray-400">
                      Debug: tenants array length = {tenants.length}, type = {typeof tenants}
                    </div>
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {tenant.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{tenant.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tenant.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tenant.domain || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tenant._count?.users || 0} users
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        tenant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tenant.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(tenant.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800 font-medium">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Subscription Plans</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {subscriptionPlans.map((plan) => (
            <div key={plan.name} className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-400 transition-colors">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold text-blue-600 mb-4">{plan.price}</p>
                <p className="text-sm text-gray-600 mb-6">{plan.users} active subscribers</p>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Manage Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.user}</p>
                </div>
                <div className="flex-shrink-0">
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setFormData({ name: "", email: "", password: "", roleId: "", tenantId: "" });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Min 8 characters"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must contain uppercase, lowercase, and number
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select 
                  required
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a role</option>
                  {roles.filter(r => r.name !== 'super_admin').map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business/Tenant (optional)
                </label>
                <select 
                  value={formData.tenantId}
                  onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None</option>
                  {tenants.map(tenant => (
                    <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserModal(false);
                    setFormData({ name: "", email: "", password: "", roleId: "", tenantId: "" });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      {showSubscriptionModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Change Subscription for {selectedUser.name}
              </h3>
              <button
                onClick={() => {
                  setShowSubscriptionModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Current Plan: <span className="font-semibold">{selectedUser.subscription}</span>
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Plan
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Basic - $29/month</option>
                  <option>Professional - $99/month</option>
                  <option>Enterprise - $299/month</option>
                </select>
              </div>            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
              <p className="text-sm text-blue-800">
                The subscription will be updated immediately and the user will be charged on their next billing cycle.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowSubscriptionModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubscriptionChange}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Tenant/Business Modal */}
      {showTenantModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Business</h3>
              <button
                onClick={() => {
                  setShowTenantModal(false);
                  setTenantFormData({ name: "", slug: "", domain: "" });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={tenantFormData.name}
                  onChange={(e) => setTenantFormData({ ...tenantFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="PrintHub Co"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug * (URL-friendly)
                </label>
                <input
                  type="text"
                  required
                  value={tenantFormData.slug}
                  onChange={(e) => setTenantFormData({ ...tenantFormData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="printhub-co"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Lowercase, hyphens only
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Domain (optional)
                </label>
                <input
                  type="text"
                  value={tenantFormData.domain}
                  onChange={(e) => setTenantFormData({ ...tenantFormData, domain: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="printhub.com"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowTenantModal(false);
                    setTenantFormData({ name: "", slug: "", domain: "" });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Add Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
