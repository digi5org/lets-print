"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ApiClient } from "@/lib/apiClient";
import toast from "react-hot-toast";

export default function DeliveryManagementPage() {
  const { token } = useAuth();
  const [selectedTab, setSelectedTab] = useState("active");
  const [deliveries, setDeliveries] = useState([]);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    scheduled: 0,
    activeDeliveries: 0,
    onTimeRate: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    orderId: "",
    customerName: "",
    customerPhone: "",
    deliveryAddress: "",
    driverName: "",
    driverPhone: "",
    vehicleNumber: "",
    estimatedDelivery: "",
    notes: "",
  });

  const fetchDeliveries = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const apiClient = new ApiClient(token);
      
      const [deliveriesRes, statsRes] = await Promise.all([
        apiClient.get("/api/deliveries"),
        apiClient.get("/api/deliveries/stats"),
      ]);

      if (deliveriesRes.success) {
        setDeliveries(deliveriesRes.data);
      }

      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      toast.error("Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchOrders = useCallback(async () => {
    if (!token) return;

    try {
      const apiClient = new ApiClient(token);
      const response = await apiClient.get("/api/orders");
      
      if (response.success) {
        // Filter orders that don't have deliveries yet
        const ordersWithoutDelivery = response.data.filter(order => 
          !deliveries.some(delivery => delivery.orderId === order.id)
        );
        setOrders(ordersWithoutDelivery);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [token, deliveries]);

  useEffect(() => {
    if (token) {
      fetchDeliveries();
    }
  }, [token, fetchDeliveries]);

  useEffect(() => {
    if (showModal && modalMode === "add") {
      fetchOrders();
    }
  }, [showModal, modalMode, fetchOrders]);

  const handleScheduleDelivery = () => {
    setModalMode("add");
    setFormData({
      orderId: "",
      customerName: "",
      customerPhone: "",
      deliveryAddress: "",
      driverName: "",
      driverPhone: "",
      vehicleNumber: "",
      estimatedDelivery: "",
      notes: "",
    });
    setShowModal(true);
  };

  const handleEditDelivery = (delivery) => {
    setModalMode("edit");
    setSelectedDelivery(delivery);
    setFormData({
      orderId: delivery.orderId,
      customerName: delivery.customerName,
      customerPhone: delivery.customerPhone || "",
      deliveryAddress: delivery.deliveryAddress,
      driverName: delivery.driverName || "",
      driverPhone: delivery.driverPhone || "",
      vehicleNumber: delivery.vehicleNumber || "",
      estimatedDelivery: delivery.estimatedDelivery 
        ? new Date(delivery.estimatedDelivery).toISOString().split('T')[0] 
        : "",
      notes: delivery.notes || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
      const apiClient = new ApiClient(token);
      
      if (modalMode === "add") {
        const response = await apiClient.post("/api/deliveries", formData);
        if (response.success) {
          toast.success("Delivery scheduled successfully");
          fetchDeliveries();
          setShowModal(false);
        }
      } else {
        const response = await apiClient.put(`/api/deliveries/${selectedDelivery.id}`, formData);
        if (response.success) {
          toast.success("Delivery updated successfully");
          fetchDeliveries();
          setShowModal(false);
        }
      }
    } catch (error) {
      console.error("Error saving delivery:", error);
      toast.error(error.message || "Failed to save delivery");
    }
  };

  const handleUpdateStatus = async (deliveryId, newStatus) => {
    if (!token) return;

    try {
      const apiClient = new ApiClient(token);
      const response = await apiClient.patch(`/api/deliveries/${deliveryId}/status`, {
        status: newStatus,
      });
      
      if (response.success) {
        toast.success(`Delivery status updated to ${newStatus}`);
        fetchDeliveries();
      }
    } catch (error) {
      console.error("Error updating delivery status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteDelivery = async (deliveryId) => {
    if (!confirm("Are you sure you want to delete this delivery?")) return;
    if (!token) return;

    try {
      const apiClient = new ApiClient(token);
      const response = await apiClient.delete(`/api/deliveries/${deliveryId}`);
      
      if (response.success) {
        toast.success("Delivery deleted successfully");
        fetchDeliveries();
      }
    } catch (error) {
      console.error("Error deleting delivery:", error);
      toast.error("Failed to delete delivery");
    }
  };

  const statsData = [
    { label: "Active Deliveries", value: stats.activeDeliveries?.toString() || "0", icon: "🚚" },
    { label: "Completed Today", value: stats.completedToday?.toString() || "0", icon: "✅" },
    { label: "Scheduled", value: stats.scheduled?.toString() || "0", icon: "📅" },
    { label: "On Time Rate", value: `${stats.onTimeRate || 0}%`, icon: "⏱️" },
  ];

  const filteredDeliveries = deliveries.filter(delivery => {
    if (selectedTab === "active") {
      return delivery.status === "In Transit" || delivery.status === "Out for Delivery";
    } else if (selectedTab === "scheduled") {
      return delivery.status === "Scheduled";
    } else if (selectedTab === "completed") {
      return delivery.status === "Delivered";
    }
    return false;
  });

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

  if (loading && deliveries.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading deliveries...</p>
        </div>
      </div>
    );
  }

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
          <button 
            onClick={handleScheduleDelivery}
            className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Schedule Delivery
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
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
        {filteredDeliveries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Deliveries Found</h3>
            <p className="text-gray-600 mb-4">
              {selectedTab === "active" && "No active deliveries at the moment"}
              {selectedTab === "scheduled" && "No scheduled deliveries"}
              {selectedTab === "completed" && "No completed deliveries yet"}
            </p>
            {selectedTab === "scheduled" && (
              <button 
                onClick={handleScheduleDelivery}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium"
              >
                Schedule Delivery
              </button>
            )}
          </div>
        ) : (
          filteredDeliveries.map((delivery) => (
            <div key={delivery.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-2xl">
                    📦
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{delivery.trackingNumber}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(delivery.status)}`}>
                        {delivery.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Order: {delivery.order?.id || delivery.orderId} • {delivery.customerName}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditDelivery(delivery)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteDelivery(delivery.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Delivery Address</p>
                  <p className="text-sm font-medium text-gray-900">{delivery.deliveryAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Driver</p>
                  <p className="text-sm font-medium text-gray-900">{delivery.driverName || "Not Assigned"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Estimated Delivery</p>
                  <p className="text-sm font-medium text-gray-900">
                    {delivery.estimatedDelivery 
                      ? new Date(delivery.estimatedDelivery).toLocaleDateString()
                      : "Not Set"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{delivery.customerPhone || "N/A"}</p>
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
                {delivery.status === "Scheduled" && (
                  <button 
                    onClick={() => handleUpdateStatus(delivery.id, "In Transit")}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm font-medium"
                  >
                    Start Delivery
                  </button>
                )}
                {delivery.status === "In Transit" && (
                  <button 
                    onClick={() => handleUpdateStatus(delivery.id, "Out for Delivery")}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm font-medium"
                  >
                    Out for Delivery
                  </button>
                )}
                {delivery.status === "Out for Delivery" && (
                  <button 
                    onClick={() => handleUpdateStatus(delivery.id, "Delivered")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium"
                  >
                    Mark as Delivered
                  </button>
                )}
                {delivery.driverPhone && (
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                    Contact Driver
                  </button>
                )}
              </div>
            </div>
          ))
        )}
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

      {/* Schedule/Edit Delivery Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalMode === "add" ? "Schedule New Delivery" : "Edit Delivery"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Order Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.orderId}
                  onChange={(e) => {
                    const selectedOrder = orders.find(o => o.id === parseInt(e.target.value));
                    setFormData({
                      ...formData,
                      orderId: e.target.value,
                      customerName: selectedOrder?.customerName || "",
                      customerPhone: selectedOrder?.customerPhone || "",
                      deliveryAddress: selectedOrder?.deliveryAddress || ""
                    });
                  }}
                  required
                  disabled={modalMode === "edit"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Select Order</option>
                  {orders.map((order) => (
                    <option key={order.id} value={order.id}>
                      Order #{order.id} - {order.customerName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Phone
                  </label>
                  <input
                    type="text"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                ></textarea>
              </div>

              {/* Driver Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driver Name
                  </label>
                  <input
                    type="text"
                    value={formData.driverName}
                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driver Phone
                  </label>
                  <input
                    type="text"
                    value={formData.driverPhone}
                    onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Delivery Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Delivery Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.estimatedDelivery}
                    onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                  placeholder="Special instructions, gate codes, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium"
                >
                  {modalMode === "add" ? "Schedule Delivery" : "Update Delivery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
