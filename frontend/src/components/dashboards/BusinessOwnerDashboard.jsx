"use client";

import { useState } from "react";

export default function BusinessOwnerDashboard({ userName }) {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { 
      name: "Total Orders", 
      value: "342", 
      change: "+12%", 
      changeType: "positive",
      icon: "📦"
    },
    { 
      name: "Revenue", 
      value: "$48,352", 
      change: "+18%", 
      changeType: "positive",
      icon: "💰"
    },
    { 
      name: "Profit Margin", 
      value: "32.4%", 
      change: "+2.1%", 
      changeType: "positive",
      icon: "📈"
    },
    { 
      name: "Pending Approvals", 
      value: "12", 
      change: "Need review", 
      changeType: "warning",
      icon: "⏳"
    },
  ];

  const orders = [
    { 
      id: "ORD-101", 
      client: "ABC Corp", 
      product: "Business Cards",
      quantity: "1000",
      status: "Pending Review", 
      date: "2025-11-02",
      total: "$250.00",
      submittedToProduction: false
    },
    { 
      id: "ORD-102", 
      client: "XYZ Inc", 
      product: "Brochures",
      quantity: "500",
      status: "Ready for Production", 
      date: "2025-11-01",
      total: "$850.00",
      submittedToProduction: false
    },
    { 
      id: "ORD-103", 
      client: "Tech Start", 
      product: "Banners",
      quantity: "10",
      status: "In Production", 
      date: "2025-10-30",
      total: "$420.00",
      submittedToProduction: true
    },
    { 
      id: "ORD-104", 
      client: "Marketing Pro", 
      product: "Flyers",
      quantity: "2000",
      status: "Completed", 
      date: "2025-10-28",
      total: "$380.00",
      submittedToProduction: true
    },
  ];

  const products = [
    { id: 1, name: "Business Cards", price: "$0.25/card", stock: "In Stock", orders: 45 },
    { id: 2, name: "Brochures", price: "$1.70/piece", stock: "In Stock", orders: 28 },
    { id: 3, name: "Banners", price: "$42.00/piece", stock: "In Stock", orders: 12 },
    { id: 4, name: "Posters", price: "$3.50/piece", stock: "Low Stock", orders: 18 },
  ];

  const clients = [
    { 
      id: 1, 
      name: "ABC Corp", 
      email: "contact@abccorp.com", 
      phone: "(555) 123-4567",
      totalOrders: 12,
      totalSpent: "$3,240",
      lastOrder: "2025-10-30",
      status: "Active"
    },
    { 
      id: 2, 
      name: "XYZ Inc", 
      email: "info@xyzinc.com", 
      phone: "(555) 234-5678",
      totalOrders: 8,
      totalSpent: "$2,180",
      lastOrder: "2025-10-28",
      status: "Active"
    },
    { 
      id: 3, 
      name: "Tech Start", 
      email: "hello@techstart.io", 
      phone: "(555) 345-6789",
      totalOrders: 15,
      totalSpent: "$4,920",
      lastOrder: "2025-11-01",
      status: "Active"
    },
    { 
      id: 4, 
      name: "Marketing Pro", 
      email: "team@marketingpro.com", 
      phone: "(555) 456-7890",
      totalOrders: 6,
      totalSpent: "$1,650",
      lastOrder: "2025-09-15",
      status: "Inactive"
    },
  ];

  const productionPipeline = {
    queue: [
      { id: "ORD-201", client: "ABC Corp", product: "Business Cards", priority: "High" },
      { id: "ORD-202", client: "XYZ Inc", product: "Brochures", priority: "Medium" },
      { id: "ORD-203", client: "Tech Start", product: "Flyers", priority: "Low" },
    ],
    inProgress: [
      { id: "ORD-204", client: "Design Co", product: "Posters", priority: "High" },
      { id: "ORD-205", client: "Print Shop", product: "Banners", priority: "Medium" },
    ],
    quality: [
      { id: "ORD-206", client: "Marketing Pro", product: "Business Cards", priority: "Medium" },
    ],
    ready: [
      { id: "ORD-207", client: "ABC Corp", product: "Letterheads", priority: "Low" },
      { id: "ORD-208", client: "XYZ Inc", product: "Envelopes", priority: "Low" },
    ]
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSubmitToProduction = () => {
    // TODO: Implement actual submission logic
    console.log("Submitting orders to production:", selectedOrders);
    setShowSubmitModal(false);
    setSelectedOrders([]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold">Business Dashboard</h1>
        <p className="mt-2 text-green-100">
          Manage your printing business, track orders, and grow your revenue.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {['overview', 'orders', 'pipeline', 'crm', 'products'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{stat.icon}</div>
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded ${
                      stat.changeType === "positive" 
                        ? "text-green-600 bg-green-100" 
                        : stat.changeType === "warning"
                        ? "text-yellow-600 bg-yellow-100"
                        : "text-red-600 bg-red-100"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-gray-600">Chart.js Revenue Chart</p>
                  <p className="text-sm text-gray-500 mt-2">6-month trend: $32K → $48K</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="text-center">
                  <div className="text-4xl mb-2">🍩</div>
                  <p className="text-gray-600">Chart.js Doughnut Chart</p>
                  <p className="text-sm text-gray-500 mt-2">Pending: 24 | Production: 45 | Shipped: 28 | Completed: 245</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <button className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Order
              </button>
              <button 
                onClick={() => setShowProductModal(true)}
                className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Product
              </button>
              <button 
                onClick={() => setActiveTab('pipeline')}
                className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Production Pipeline
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Reports
              </button>
            </div>
          </div>

          {/* Recent Orders Preview */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <button 
                onClick={() => setActiveTab('orders')}
                className="text-sm text-green-600 hover:text-green-800 font-medium"
              >
                View All →
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {orders.slice(0, 4).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">📦</div>
                        <div>
                          <p className="font-medium text-gray-900">{order.product}</p>
                          <p className="text-sm text-gray-500">{order.id} • {order.client} • {order.quantity} units</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-semibold text-gray-900">{order.total}</p>
                      <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "In Production"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "Ready for Production"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Orders Management</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                Filter
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                Export
              </button>
            </div>
          </div>
          <div className="p-4 bg-yellow-50 border-b border-yellow-100">
            {selectedOrders.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {selectedOrders.length} order(s) selected
                </span>
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                >
                  Submit to Production
                </button>
              </div>
            )}
          </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
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
                    <input 
                      type="checkbox"
                      className="rounded"
                      disabled={order.submittedToProduction}
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "In Production"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "Ready for Production"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      View
                    </button>
                    <button className="text-green-600 hover:text-green-800 font-medium">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {/* Production Pipeline Tab */}
      {activeTab === 'pipeline' && (
        <div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Production Pipeline</h2>
            <p className="text-sm text-gray-600">Drag and drop orders between stages to update their status</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Queue */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Queue</h3>
                <p className="text-xs text-gray-500">{productionPipeline.queue.length} orders</p>
              </div>
              <div className="p-4 space-y-3">
                {productionPipeline.queue.map((item) => (
                  <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-move hover:shadow-md transition-shadow">
                    <p className="font-medium text-sm text-gray-900">{item.id}</p>
                    <p className="text-xs text-gray-600">{item.client}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.product}</p>
                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                      item.priority === 'High' ? 'bg-red-100 text-red-800' :
                      item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 py-3 bg-blue-50 border-b border-blue-200">
                <h3 className="font-semibold text-blue-900">In Progress</h3>
                <p className="text-xs text-blue-600">{productionPipeline.inProgress.length} orders</p>
              </div>
              <div className="p-4 space-y-3">
                {productionPipeline.inProgress.map((item) => (
                  <div key={item.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-move hover:shadow-md transition-shadow">
                    <p className="font-medium text-sm text-gray-900">{item.id}</p>
                    <p className="text-xs text-gray-600">{item.client}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.product}</p>
                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                      item.priority === 'High' ? 'bg-red-100 text-red-800' :
                      item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Check */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 py-3 bg-yellow-50 border-b border-yellow-200">
                <h3 className="font-semibold text-yellow-900">Quality Check</h3>
                <p className="text-xs text-yellow-600">{productionPipeline.quality.length} orders</p>
              </div>
              <div className="p-4 space-y-3">
                {productionPipeline.quality.map((item) => (
                  <div key={item.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 cursor-move hover:shadow-md transition-shadow">
                    <p className="font-medium text-sm text-gray-900">{item.id}</p>
                    <p className="text-xs text-gray-600">{item.client}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.product}</p>
                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                      item.priority === 'High' ? 'bg-red-100 text-red-800' :
                      item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ready to Ship */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 py-3 bg-green-50 border-b border-green-200">
                <h3 className="font-semibold text-green-900">Ready to Ship</h3>
                <p className="text-xs text-green-600">{productionPipeline.ready.length} orders</p>
              </div>
              <div className="p-4 space-y-3">
                {productionPipeline.ready.map((item) => (
                  <div key={item.id} className="p-3 bg-green-50 rounded-lg border border-green-200 cursor-move hover:shadow-md transition-shadow">
                    <p className="font-medium text-sm text-gray-900">{item.id}</p>
                    <p className="text-xs text-gray-600">{item.client}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.product}</p>
                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                      item.priority === 'High' ? 'bg-red-100 text-red-800' :
                      item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CRM Tab */}
      {activeTab === 'crm' && (
        <div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Client Management (CRM)</h2>
                <p className="text-sm text-gray-600 mt-1">Total Customers: 1,248 • Avg Customer Value: $2,450</p>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Add New Client
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold">
                            {client.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{client.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {client.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {client.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {client.totalOrders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {client.totalSpent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {client.lastOrder}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            client.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {client.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-800 font-medium">
                          Email
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Products</h2>
          <button 
            onClick={() => setShowProductModal(true)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Manage Products →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
          {products.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <span className={`text-xs px-2 py-1 rounded ${
                  product.stock === "In Stock" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {product.stock}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{product.price}</p>
              <p className="text-sm text-gray-500">{product.orders} orders this month</p>
              <button className="mt-3 w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
                Edit Product
              </button>
            </div>
          ))}
        </div>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Product</h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Business Cards"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., $0.25/card"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Product description..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowProductModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Implement save logic
                  setShowProductModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit to Production Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Submit to Production</h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              You are about to submit {selectedOrders.length} order(s) to the production facility. 
              This action will notify the production team and move the orders to the production queue.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Once submitted, orders cannot be edited without contacting production.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitToProduction}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
