"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ApiClient } from "@/lib/apiClient";
import toast from "react-hot-toast";

export default function TeamManagementPage() {
  const { user, session } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  });

  // Check if user can manage team (add/edit/delete)
  const canManageTeam = user?.roleName === "production_owner" || user?.roleName === "production_manager";

  // Debug logging
  useEffect(() => {
    console.log('🔍 User object:', user);
    console.log('👤 User roleName:', user?.roleName);
    console.log('🔐 Can manage team:', canManageTeam);
  }, [user, canManageTeam]);

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      if (!session?.accessToken) {
        console.error("No access token available");
        setTeamMembers(getSampleTeamMembers());
        return;
      }
      const api = new ApiClient(session.accessToken);
      const response = await api.get("/api/production/team");
      setTeamMembers(response.members || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to load team members");
      // Fallback to sample data for demo
      setTeamMembers(getSampleTeamMembers());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchTeamMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken]);

  const getSampleTeamMembers = () => [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@letsprint.com",
      role: "Production Manager",
      department: "Production",
      status: "Active",
      avatar: "👨‍💼",
      joinedDate: "Jan 15, 2024",
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@letsprint.com",
      role: "Quality Inspector",
      department: "Quality Control",
      status: "Active",
      avatar: "👩‍🔬",
      joinedDate: "Mar 22, 2024",
      lastActive: "5 min ago",
    },
    {
      id: 3,
      name: "Mike Davis",
      email: "mike.d@letsprint.com",
      role: "Machine Operator",
      department: "Production",
      status: "Active",
      avatar: "👨‍🔧",
      joinedDate: "Feb 10, 2024",
      lastActive: "1 hour ago",
    },
    {
      id: 4,
      name: "Emily Chen",
      email: "emily.c@letsprint.com",
      role: "Delivery Coordinator",
      department: "Delivery",
      status: "Active",
      avatar: "👩‍💼",
      joinedDate: "Apr 5, 2024",
      lastActive: "30 min ago",
    },
    {
      id: 5,
      name: "Robert Wilson",
      email: "robert.w@letsprint.com",
      role: "Machine Operator",
      department: "Production",
      status: "Offline",
      avatar: "👨‍🏭",
      joinedDate: "May 18, 2024",
      lastActive: "Yesterday",
    },
  ];

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      if (!session?.accessToken) {
        toast.error("Authentication required");
        return;
      }
      const api = new ApiClient(session.accessToken);
      const response = await api.post("/api/production/team", formData);
      toast.success("Team member added successfully!");
      setTeamMembers([...teamMembers, response.member]);
      setShowAddModal(false);
      setFormData({ name: "", email: "", department: "" });
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error(error.message || "Failed to add team member");
    }
  };

  const handleEditMember = async (e) => {
    e.preventDefault();
    try {
      if (!session?.accessToken) {
        toast.error("Authentication required");
        return;
      }
      const api = new ApiClient(session.accessToken);
      const response = await api.put(`/api/production/team/${selectedMember.id}`, formData);
      toast.success("Team member updated successfully!");
      setTeamMembers(teamMembers.map(m => m.id === selectedMember.id ? response.member : m));
      setShowEditModal(false);
      setSelectedMember(null);
      setFormData({ name: "", email: "", role: "production_staff", department: "" });
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error(error.message || "Failed to update team member");
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    
    try {
      if (!session?.accessToken) {
        toast.error("Authentication required");
        return;
      }
      const api = new ApiClient(session.accessToken);
      await api.delete(`/api/production/team/${memberId}`);
      toast.success("Team member removed successfully!");
      setTeamMembers(teamMembers.filter(m => m.id !== memberId));
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error(error.message || "Failed to remove team member");
    }
  };

  const openEditModal = (member) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      department: member.department,
    });
    setShowEditModal(true);
  };

  // Filter team members
  const filteredMembers = teamMembers.filter(member => {
    const matchesDepartment = selectedDepartment === "all" || 
      member.department.toLowerCase().includes(selectedDepartment.toLowerCase());
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  // Calculate stats
  const stats = [
    { label: "Total Team Members", value: teamMembers.length, icon: "👥" },
    { label: "Active Now", value: teamMembers.filter(m => m.status === "Active").length, icon: "🟢" },
    { label: "Offline", value: teamMembers.filter(m => m.status === "Offline").length, icon: "🔴" },
    { 
      label: "Departments", 
      value: [...new Set(teamMembers.map(m => m.department))].filter(Boolean).length, 
      icon: "🏢" 
    },
  ];

  const departments = [
    { 
      name: "Production", 
      members: teamMembers.filter(m => m.department === "Production").length, 
      icon: "🏭" 
    },
    { 
      name: "Quality Control", 
      members: teamMembers.filter(m => m.department === "Quality Control").length, 
      icon: "✅" 
    },
    { 
      name: "Delivery", 
      members: teamMembers.filter(m => m.department === "Delivery").length, 
      icon: "🚚" 
    },
    { 
      name: "Maintenance", 
      members: teamMembers.filter(m => m.department === "Maintenance").length, 
      icon: "🔧" 
    },
  ];

  const getStatusColor = (status) => {
    return status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Team Management</h1>
            <p className="text-teal-100">
              Manage your production team and assignments
            </p>
          </div>
          {canManageTeam && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-white text-teal-600 hover:bg-teal-50 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Team Member
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Departments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Departments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((dept) => (
            <div key={dept.name} className="p-4 border border-gray-200 rounded-lg hover:border-teal-500 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl">{dept.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                  <p className="text-sm text-gray-500">{dept.members} members</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Filter & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <svg 
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedDepartment("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedDepartment === "all"
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Departments
          </button>
          <button
            onClick={() => setSelectedDepartment("production")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedDepartment === "production"
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Production
          </button>
          <button
            onClick={() => setSelectedDepartment("quality")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedDepartment === "quality"
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Quality Control
          </button>
          <button
            onClick={() => setSelectedDepartment("maintenance")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedDepartment === "maintenance"
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Maintenance
          </button>
        </div>
      </div>

      {/* Team Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No team members found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? "Try adjusting your search terms" : "Add your first team member to get started"}
          </p>
          {!searchTerm && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-all inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Team Member
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 h-20"></div>
            <div className="px-6 pb-6">
              <div className="flex items-start justify-between -mt-10 mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-4xl border-4 border-white">
                  {member.avatar}
                </div>
                <span className={`mt-12 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.status)}`}>
                  {member.status}
                </span>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-teal-600 font-medium mb-1">{member.department}</p>
                <p className="text-xs text-gray-500">{member.email}</p>
              </div>
              <div className="space-y-2 mb-4 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Joined {member.joinedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Last active {member.lastActive}</span>
                </div>
              </div>
              {canManageTeam && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(member)}
                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all text-sm font-medium"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => handleDeleteMember(member.id)}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-all text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Activity Log */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { user: "John Smith", action: "completed order", target: "ORD-001", time: "10 min ago", icon: "✅" },
            { user: "Sarah Johnson", action: "started quality check", target: "ORD-002", time: "25 min ago", icon: "🔍" },
            { user: "Mike Davis", action: "updated machine status", target: "Printer-X500", time: "1 hour ago", icon: "🔧" },
            { user: "Emily Chen", action: "scheduled delivery", target: "DEL-003", time: "2 hours ago", icon: "🚚" },
            { user: "Robert Wilson", action: "logged in", target: "System", time: "3 hours ago", icon: "🔐" },
          ].map((activity, index) => (
            <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl">{activity.icon}</div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-semibold">{activity.target}</span>
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Add Team Member</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  <option value="Production">Production</option>
                  <option value="Quality Control">Quality Control</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Edit Team Member</h3>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedMember(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  <option value="Production">Production</option>
                  <option value="Quality Control">Quality Control</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedMember(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all"
                >
                  Update Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
