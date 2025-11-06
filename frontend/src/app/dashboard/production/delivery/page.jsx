"use client";

import { useState } from "react";

export default function DeliveryManagementPage() {
  const [selectedTab, setSelectedTab] = useState("active");

  const deliveries = [
    {
      id: "DEL-001",
      orderId: "ORD-001",
      customer: "ABC Corp",
      address: "123 Main St, New York, NY 10001",
      status: "In Transit",
      driver: "John Smith",
      estimatedDelivery: "Nov 7, 2025",
      trackingNumber: "TRK-1234567890",
    },
    {
      id: "DEL-002",
      orderId: "ORD-002",
      customer: "XYZ Inc",
      address: "456 Oak Ave, Los Angeles, CA 90001",
      status: "Out for Delivery",
      driver: "Sarah Johnson",
      estimatedDelivery: "Nov 6, 2025",
      trackingNumber: "TRK-0987654321",
    },
    {
      id: "DEL-003",
      orderId: "ORD-003",
      customer: "Tech Start",
      address: "789 Pine Rd, Chicago, IL 60601",
      status: "Delivered",
      driver: "Mike Davis",
      estimatedDelivery: "Nov 5, 2025",
      trackingNumber: "TRK-5678901234",
    },
    {
      id: "DEL-004",
      orderId: "ORD-004",
      customer: "Marketing Pro",
      address: "321 Elm St, Boston, MA 02101",
      status: "Scheduled",
      driver: "Not Assigned",
      estimatedDelivery: "Nov 10, 2025",
      trackingNumber: "TRK-4321098765",
    },
  ];

  const stats = [
    { label: "Active Deliveries", value: "12", icon: "🚚" },
    { label: "Completed Today", value: "8", icon: "✅" },
    { label: "Scheduled", value: "15", icon: "📅" },
    { label: "On Time Rate", value: "96%", icon: "⏱️" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "In Transit":
        return "bg-blue-100 text-blue-700";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-700";
      case "Scheduled":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Delivery Management</h1>
            <p className="text-indigo-100">
              Track and manage all deliveries
            </p>
          </div>
          <button className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Schedule Delivery
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

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedTab("active")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedTab === "active"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Active Deliveries
          </button>
          <button
            onClick={() => setSelectedTab("scheduled")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedTab === "scheduled"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Scheduled
          </button>
          <button
            onClick={() => setSelectedTab("completed")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedTab === "completed"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="space-y-4">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-2xl">
                  📦
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{delivery.id}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(delivery.status)}`}>
                      {delivery.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Order: {delivery.orderId} • {delivery.customer}</p>
                </div>
              </div>
              <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                Track
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Delivery Address</p>
                <p className="text-sm font-medium text-gray-900">{delivery.address}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Driver</p>
                <p className="text-sm font-medium text-gray-900">{delivery.driver}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Estimated Delivery</p>
                <p className="text-sm font-medium text-gray-900">{delivery.estimatedDelivery}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Tracking Number</p>
                <p className="text-sm font-medium text-gray-900">{delivery.trackingNumber}</p>
              </div>
            </div>
            {delivery.status === "In Transit" && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">Delivery Progress</span>
                  <span className="text-xs font-medium text-gray-900">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm font-medium">
                View Details
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                Contact Driver
              </button>
              {delivery.status === "Scheduled" && (
                <button className="px-4 py-2 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-all text-sm font-medium">
                  Assign Driver
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Map View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Tracking Map</h2>
        <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-lg font-medium">Map View</p>
            <p className="text-sm">Real-time delivery tracking would appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
