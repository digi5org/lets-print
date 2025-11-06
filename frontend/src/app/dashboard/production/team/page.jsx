"use client";

import { useState } from "react";

export default function TeamManagementPage() {
  const [selectedRole, setSelectedRole] = useState("all");

  const teamMembers = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@letsprint.com",
      role: "Production Manager",
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
      status: "Offline",
      avatar: "👨‍🏭",
      joinedDate: "May 18, 2024",
      lastActive: "Yesterday",
    },
  ];

  const stats = [
    { label: "Total Team Members", value: "24", icon: "👥" },
    { label: "Active Now", value: "18", icon: "🟢" },
    { label: "On Leave", value: "2", icon: "🏖️" },
    { label: "Departments", value: "4", icon: "🏢" },
  ];

  const departments = [
    { name: "Production", members: 12, icon: "🏭" },
    { name: "Quality Control", members: 4, icon: "✅" },
    { name: "Delivery", members: 5, icon: "🚚" },
    { name: "Maintenance", members: 3, icon: "🔧" },
  ];

  const getStatusColor = (status) => {
    return status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700";
  };

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
          <button className="bg-white text-teal-600 hover:bg-teal-50 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Team Member
          </button>
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

      {/* Role Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedRole("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedRole === "all"
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Members
          </button>
          <button
            onClick={() => setSelectedRole("manager")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedRole === "manager"
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Managers
          </button>
          <button
            onClick={() => setSelectedRole("operator")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedRole === "operator"
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Operators
          </button>
          <button
            onClick={() => setSelectedRole("coordinator")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedRole === "coordinator"
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Coordinators
          </button>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
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
                <p className="text-sm text-teal-600 font-medium mb-1">{member.role}</p>
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
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all text-sm font-medium">
                  View Profile
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
}
