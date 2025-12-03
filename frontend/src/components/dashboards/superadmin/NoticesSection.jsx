"use client";

import { useState } from "react";

export default function NoticesSection() {
  const [showModal, setShowModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const notices = [
    {
      id: 1,
      title: "System Maintenance Scheduled",
      content:
        "We will be performing scheduled maintenance on December 5th, 2024 from 2:00 AM to 4:00 AM EST.",
      type: "maintenance",
      status: "active",
      audience: "all",
      createdAt: "2024-12-01",
      expiresAt: "2024-12-05",
    },
    {
      id: 2,
      title: "New Feature: Bulk Order Upload",
      content:
        "We've added a new feature that allows you to upload multiple orders at once using CSV files.",
      type: "feature",
      status: "active",
      audience: "business_owners",
      createdAt: "2024-11-28",
      expiresAt: "2024-12-28",
    },
    {
      id: 3,
      title: "Holiday Shipping Deadlines",
      content: "Please note the holiday shipping deadlines to ensure your orders arrive on time.",
      type: "announcement",
      status: "active",
      audience: "all",
      createdAt: "2024-11-25",
      expiresAt: "2024-12-25",
    },
    {
      id: 4,
      title: "Price Update Notification",
      content: "Starting January 1st, 2025, there will be a 5% increase in shipping rates.",
      type: "announcement",
      status: "draft",
      audience: "all",
      createdAt: "2024-11-20",
      expiresAt: "2025-01-31",
    },
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "feature":
        return "bg-green-100 text-green-800";
      case "announcement":
        return "bg-blue-100 text-blue-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notices</h1>
          <p className="text-gray-600 mt-1">Manage system announcements and notifications</p>
        </div>
        <button
          onClick={() => {
            setSelectedNotice(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Notice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Active Notices</p>
          <p className="text-2xl font-bold text-green-600">{notices.filter((n) => n.status === "active").length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-gray-500">
          <p className="text-sm text-gray-600">Draft</p>
          <p className="text-2xl font-bold text-gray-600">{notices.filter((n) => n.status === "draft").length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Maintenance</p>
          <p className="text-2xl font-bold text-yellow-600">{notices.filter((n) => n.type === "maintenance").length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Announcements</p>
          <p className="text-2xl font-bold text-blue-600">{notices.filter((n) => n.type === "announcement").length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notice</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Audience</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {notices.map((notice) => (
              <tr key={notice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{notice.title}</p>
                  <p className="text-sm text-gray-500 truncate max-w-md">{notice.content}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getTypeColor(notice.type)}`}>
                    {notice.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 capitalize">{notice.audience.replace("_", " ")}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(notice.status)}`}>
                    {notice.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{notice.expiresAt}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => {
                      setSelectedNotice(notice);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {selectedNotice ? "Edit Notice" : "Create New Notice"}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  defaultValue={selectedNotice?.title || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Notice title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea
                  rows={4}
                  defaultValue={selectedNotice?.content || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Notice content..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    defaultValue={selectedNotice?.type || "announcement"}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="feature">Feature</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                  <select
                    defaultValue={selectedNotice?.audience || "all"}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Users</option>
                    <option value="business_owners">Business Owners</option>
                    <option value="production_owners">Production Owners</option>
                    <option value="clients">Clients</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
                <input
                  type="date"
                  defaultValue={selectedNotice?.expiresAt || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
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
                  {selectedNotice ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
