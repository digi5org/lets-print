"use client";

import { useState } from "react";

export default function OrdersManagementPage() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const orders = [
    {
      id: "ORD-001",
      customer: "ABC Corp",
      product: "Business Cards",
      quantity: "1000 cards",
      status: "In Progress",
      priority: "High",
      dueDate: "Nov 8, 2025",
      amount: "$450.00",
      progress: 65,
    },
    {
      id: "ORD-002",
      customer: "XYZ Inc",
      product: "Brochures",
      quantity: "500 units",
      status: "Quality Check",
      priority: "Medium",
      dueDate: "Nov 10, 2025",
      amount: "$850.00",
      progress: 85,
    },
    {
      id: "ORD-003",
      customer: "Tech Start",
      product: "Banners",
      quantity: "10 banners",
      status: "Completed",
      priority: "High",
      dueDate: "Nov 5, 2025",
      amount: "$1,200.00",
      progress: 100,
    },
    {
      id: "ORD-004",
      customer: "Marketing Pro",
      product: "Flyers",
      quantity: "2000 units",
      status: "Pending",
      priority: "Low",
      dueDate: "Nov 15, 2025",
      amount: "$320.00",
      progress: 0,
    },
    {
      id: "ORD-005",
      customer: "Design Studio",
      product: "Posters",
      quantity: "100 posters",
      status: "In Progress",
      priority: "Medium",
      dueDate: "Nov 12, 2025",
      amount: "$680.00",
      progress: 45,
    },
  ];

  const stats = [
    { label: "Total Orders", value: "156", icon: "📦", color: "blue" },
    { label: "In Progress", value: "23", icon: "⚙️", color: "yellow" },
    { label: "Completed", value: "128", icon: "✅", color: "green" },
    { label: "Pending", value: "5", icon: "⏳", color: "gray" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Quality Check":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Orders Management</h1>
            <p className="text-purple-100">
              Manage and track all production orders
            </p>
          </div>
          <button className="bg-white text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Order
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

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedStatus === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatus("pending")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedStatus === "pending"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setSelectedStatus("in-progress")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedStatus === "in-progress"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              In Progress
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customer}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{order.product}</div>
                    <div className="text-xs text-gray-500">{order.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{order.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-purple-600 hover:text-purple-900 mr-3">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
