"use client";

import { useState } from "react";

export default function TicketsPage() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const tickets = [
    {
      id: "TKT-001",
      title: "Printing Quality Issue",
      customer: "ABC Corp",
      priority: "High",
      status: "Open",
      category: "Quality",
      createdAt: "Nov 5, 2025",
      description: "Colors on business cards are not matching the proof",
    },
    {
      id: "TKT-002",
      title: "Delivery Delay",
      customer: "XYZ Inc",
      priority: "Medium",
      status: "In Progress",
      category: "Delivery",
      createdAt: "Nov 4, 2025",
      description: "Order was supposed to arrive yesterday but still pending",
    },
    {
      id: "TKT-003",
      title: "Invoice Discrepancy",
      customer: "Tech Start",
      priority: "Low",
      status: "Resolved",
      category: "Billing",
      createdAt: "Nov 3, 2025",
      description: "Invoice amount doesn't match the quote provided",
    },
    {
      id: "TKT-004",
      title: "Design File Issues",
      customer: "Marketing Pro",
      priority: "High",
      status: "Open",
      category: "Design",
      createdAt: "Nov 6, 2025",
      description: "Unable to open the design files provided by customer",
    },
    {
      id: "TKT-005",
      title: "Equipment Maintenance",
      customer: "Internal",
      priority: "Medium",
      status: "In Progress",
      category: "Technical",
      createdAt: "Nov 2, 2025",
      description: "Large format printer needs routine maintenance",
    },
  ];

  const stats = [
    { label: "Open Tickets", value: "12", icon: "📝", color: "blue" },
    { label: "In Progress", value: "8", icon: "⚙️", color: "yellow" },
    { label: "Resolved Today", value: "15", icon: "✅", color: "green" },
    { label: "Avg. Response Time", value: "2.5h", icon: "⏱️", color: "purple" },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-orange-100 text-orange-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "Closed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tickets</h1>
            <p className="text-red-100">
              Support tickets and issue tracking
            </p>
          </div>
          <button className="bg-white text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Ticket
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStatus("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedStatus === "all"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Tickets
          </button>
          <button
            onClick={() => setSelectedStatus("open")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedStatus === "open"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setSelectedStatus("in-progress")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedStatus === "in-progress"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setSelectedStatus("resolved")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedStatus === "resolved"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 gap-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedTicket(ticket)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {ticket.customer}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {ticket.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {ticket.createdAt}
                  </span>
                </div>
              </div>
              <div className="text-2xl ml-4">🎫</div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium">
                View Details
              </button>
              {ticket.status !== "Resolved" && (
                <>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                    Update Status
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                    Add Comment
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Ticket Details</h2>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 transition hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedTicket.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">Ticket ID: {selectedTicket.id}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedTicket.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedTicket.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedTicket.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedTicket.createdAt}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4">
                  {selectedTicket.description}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Update Status
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-red-500 hover:text-red-600"
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
