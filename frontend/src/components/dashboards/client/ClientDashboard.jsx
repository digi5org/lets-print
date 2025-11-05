"use client";

import { useState } from "react";
import TrackShipment from "./TrackShipment";
import DesignLibrary from "./DesignLibrary";
import InvoicesPayments from "./InvoicesPayments";
import { clientSidebarItems } from "@/config/navigation";

export default function ClientDashboard({ userName }) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [orderDetailModal, setOrderDetailModal] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showNotifications, setShowNotifications] = useState(false);

  const stats = [
    { 
      name: "Active Orders", 
      value: "5", 
      change: "2 in production", 
      changeType: "positive",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "blue"
    },
    { 
      name: "Total Spent", 
      value: "$12,450", 
      change: "+$1,200", 
      changeType: "positive",
      subtext: "Last 6 months",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: "green"
    },
    { 
      name: "Pending Approval", 
      value: "3", 
      change: "Design proofs", 
      changeType: "warning",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "purple"
    },
    { 
      name: "Unpaid Invoices", 
      value: "$845", 
      change: "2 invoices", 
      changeType: "warning",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "orange"
    },
  ];

  const recentOrders = [
    { 
      id: "ORD-1023", 
      title: "Business Cards", 
      status: "Production", 
      date: "Dec 10, 2024",
      quantity: "500 cards",
      total: "$450.00",
      customer: "Tech Solutions Inc.",
      deliveryDate: "Dec 15, 2024",
      notes: "Premium finish with gold foil"
    },
    { 
      id: "ORD-1018", 
      title: "Flyers - 500pc", 
      status: "Shipped", 
      date: "Dec 8, 2024",
      quantity: "500 units",
      total: "$320.00",
      customer: "Marketing Agency",
      deliveryDate: "Dec 12, 2024",
      trackingNumber: "TRK123456789"
    },
    { 
      id: "ORD-1015", 
      title: "Banners", 
      status: "Delivered", 
      date: "Dec 5, 2024",
      quantity: "3 banners",
      total: "$180.00",
      customer: "Event Planners Co.",
      deliveryDate: "Dec 8, 2024"
    },
    { 
      id: "ORD-1012", 
      title: "Brochures", 
      status: "Delivered", 
      date: "Dec 1, 2024",
      quantity: "200 units",
      total: "$290.00",
      customer: "Real Estate Group",
      deliveryDate: "Dec 5, 2024"
    },
    { 
      id: "ORD-1008", 
      title: "Posters A2", 
      status: "Cancelled", 
      date: "Nov 28, 2024",
      quantity: "50 posters",
      total: "$220.00",
      customer: "Music Festival",
      deliveryDate: "N/A"
    },
  ];

  const invoices = [
    { 
      id: "INV-2024-1023", 
      orderId: "ORD-1023",
      date: "Dec 10, 2024", 
      amount: "$450.00", 
      status: "Pending",
      dueDate: "Dec 24, 2024"
    },
    { 
      id: "INV-2024-1018", 
      orderId: "ORD-1018",
      date: "Dec 8, 2024", 
      amount: "$320.00", 
      status: "Pending",
      dueDate: "Dec 22, 2024"
    },
    { 
      id: "INV-2024-1015", 
      orderId: "ORD-1015",
      date: "Dec 5, 2024", 
      amount: "$180.00", 
      status: "Paid",
      dueDate: "Dec 19, 2024"
    },
    { 
      id: "INV-2024-1012", 
      orderId: "ORD-1012",
      date: "Dec 1, 2024", 
      amount: "$290.00", 
      status: "Paid",
      dueDate: "Dec 15, 2024"
    },
  ];

  const products = [
    {
      id: 1,
      name: "Business Cards",
      category: "Stationery",
      price: "From $45",
      image: "📇",
      description: "Premium business cards with various finishes"
    },
    {
      id: 2,
      name: "Flyers",
      category: "Marketing",
      price: "From $80",
      image: "📄",
      description: "Eye-catching flyers for promotions"
    },
    {
      id: 3,
      name: "Banners",
      category: "Large Format",
      price: "From $120",
      image: "🎯",
      description: "Large format banners for events"
    },
    {
      id: 4,
      name: "Brochures",
      category: "Marketing",
      price: "From $150",
      image: "📰",
      description: "Professional brochures for your business"
    },
    {
      id: 5,
      name: "Posters",
      category: "Marketing",
      price: "From $95",
      image: "🖼️",
      description: "High-quality posters in various sizes"
    },
    {
      id: 6,
      name: "Stickers",
      category: "Specialty",
      price: "From $60",
      image: "✨",
      description: "Custom stickers with die-cut options"
    },
  ];

  const notifications = [
    { id: 1, type: "success", message: "Order ORD-1023 is now in production", time: "5 min ago" },
    { id: 2, type: "info", message: "Your invoice INV-2024-1018 is due in 3 days", time: "1 hour ago" },
    { id: 3, type: "warning", message: "Design approval needed for ORD-1025", time: "2 hours ago" },
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    console.log("Uploading file:", selectedFile);
    setUploadModalOpen(false);
    setSelectedFile(null);
  };

  const handleViewOrder = (order) => {
    setOrderDetailModal(order);
  };

  const handleExportOrders = () => {
    console.log("Exporting orders...");
  };

  const filteredOrders = recentOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'amount') {
      return parseFloat(b.total.replace('$', '')) - parseFloat(a.total.replace('$', ''));
    }
    return 0;
  });

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo/Brand Area */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Let&apos;s Print</h2>
          <p className="text-xs text-gray-500 mt-1">Client Portal</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {clientSidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeView === item.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  activeView === item.id
                    ? 'bg-white text-blue-600'
                    : 'bg-red-500 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Info at Bottom */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-500">Client</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-6">
          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <>
              {/* Page Header with Actions */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-xl shadow-sm p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {userName.split(' ')[0]}!</h1>
                    <p className="text-blue-100">
                      Here&apos;s your order activity and account overview
                    </p>
                  </div>
                  <div className="hidden md:flex gap-3">
                    <button 
                      onClick={() => setUploadModalOpen(true)}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload Design
                    </button>
                    <button className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      New Order
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.name}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-12 h-12 rounded-lg ${colorClasses[stat.color]} flex items-center justify-center border`}>
                          {stat.icon}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                        <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                        {stat.subtext && (
                          <p className="text-xs text-gray-500 mb-1">{stat.subtext}</p>
                        )}
                        <p
                          className={`text-xs font-medium ${
                            stat.changeType === "positive" 
                              ? "text-green-600" 
                              : stat.changeType === "warning"
                              ? "text-orange-600"
                              : "text-red-600"
                          }`}
                        >
                          {stat.change}
                        </p>
                      </div>
                    </div>
                    {stat.changeType === "positive" && (
                      <div className="h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
                    )}
                    {stat.changeType === "warning" && (
                      <div className="h-1 bg-gradient-to-r from-orange-400 to-orange-600"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Dashboard Content */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 space-y-6">
            {/* Recent Orders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                <button 
                  onClick={() => setActiveView('my-orders')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  View All
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="grid gap-4">
                {recentOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-3xl">📦</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900">{order.title}</p>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "Shipped"
                                  ? "bg-blue-100 text-blue-700"
                                  : order.status === "Production"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : order.status === "Cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{order.id} • {order.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-lg">{order.total}</p>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Order Status */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Order Status</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Order ID: <span className="font-semibold text-gray-900">ORD-1023</span></p>
                    <p className="text-lg font-bold text-gray-900 mt-1">Business Cards</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                    Production
                  </span>
                </div>
                
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                  <div className="space-y-6 relative">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center relative z-10 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-semibold text-gray-900 text-sm">Order Placed</p>
                        <p className="text-xs text-gray-500">Dec 10, 2024 - 10:30 AM</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center relative z-10 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-semibold text-gray-900 text-sm">Design Approved</p>
                        <p className="text-xs text-gray-500">Dec 10, 2024 - 2:15 PM</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center relative z-10 flex-shrink-0 animate-pulse">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-semibold text-gray-900 text-sm">In Production</p>
                        <p className="text-xs text-blue-600 font-medium">Currently in progress...</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center relative z-10 flex-shrink-0">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-medium text-gray-400 text-sm">Ready for Pickup</p>
                        <p className="text-xs text-gray-400">Pending</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Spending Overview Chart */}
            <div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Spending Overview</h2>
                <div className="h-64 flex items-end justify-between gap-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
                    const heights = [40, 65, 45, 80, 70, 90];
                    const amounts = ['$1,200', '$2,100', '$1,500', '$2,800', '$2,400', '$3,200'];
                    return (
                      <div key={month} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="relative w-full">
                          <div 
                            className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-colors cursor-pointer" 
                            style={{ height: `${heights[index] * 2.5}px` }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {amounts[index]}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
              </div>
            </>
          )}

        {/* Orders Tab */}
        {activeView === 'my-orders' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            {/* Search and Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search orders by ID or product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="production">Production</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="amount">Sort by Amount</option>
                </select>
                <button 
                  onClick={handleExportOrders}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-blue-600">{order.id}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-gray-900">{order.title}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">{order.quantity}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "Production"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">{order.date}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-semibold text-gray-900">{order.total}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button 
                          onClick={() => handleViewOrder(order)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium mr-3"
                        >
                          View
                        </button>
                        {order.trackingNumber && (
                          <button className="text-sm text-gray-600 hover:text-gray-800 font-medium">
                            Track
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {sortedOrders.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No orders found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeView === 'invoices' && (
          <InvoicesPayments onBack={() => setActiveView('dashboard')} />
        )}

        {/* Products Tab */}
        {activeView === 'browse-products' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 space-y-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All Categories</option>
                <option>Stationery</option>
                <option>Marketing</option>
                <option>Large Format</option>
                <option>Specialty</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden group">
                  <div className="h-44 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                    {product.image}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                        {product.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">{product.description}</p>
                    <p className="text-sm text-gray-600 font-medium mb-4">{product.price}</p>
                    <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Order Now
                    </button>
                  </div>
                </div>
                ))}
            </div>
          </div>
          </div>
        )}

        {/* New Order View */}
        {activeView === 'new-order' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Order</h2>
            <p className="text-gray-600">New order form will be displayed here.</p>
          </div>
        )}

        {/* Track Shipment View */}
        {activeView === 'track-shipment' && (
          <TrackShipment onBack={() => setActiveView('dashboard')} />
        )}

        {/* Design Library View */}
        {activeView === 'design-library' && (
          <DesignLibrary onBack={() => setActiveView('dashboard')} />
        )}

        {/* Support View */}
        {activeView === 'support' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Support</h2>
            <p className="text-gray-600">Support center will be displayed here.</p>
          </div>
        )}

        {/* Tickets View */}
        {activeView === 'tickets' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Support Tickets</h2>
            <p className="text-gray-600">Your support tickets will be displayed here.</p>
          </div>
        )}

        {/* My Account View */}
        {activeView === 'my-account' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Account</h2>
            <p className="text-gray-600">Account settings will be displayed here.</p>
          </div>
        )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {orderDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900">Order details</h2>
              <button
                type="button"
                onClick={() => setOrderDetailModal(null)}
                className="text-gray-400 transition hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-sm font-semibold text-gray-900">{orderDetailModal.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-sm font-semibold text-gray-900">{orderDetailModal.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Product</p>
                  <p className="text-sm font-semibold text-gray-900">{orderDetailModal.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="text-sm font-semibold text-gray-900">{orderDetailModal.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Placed</p>
                  <p className="text-sm font-semibold text-gray-900">{orderDetailModal.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery</p>
                  <p className="text-sm font-semibold text-gray-900">{orderDetailModal.deliveryDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="text-sm font-semibold text-gray-900">{orderDetailModal.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-base font-semibold text-gray-900">{orderDetailModal.total}</p>
                </div>
              </div>

              {orderDetailModal.trackingNumber && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                  Tracking number: <span className="font-semibold">{orderDetailModal.trackingNumber}</span>
                </div>
              )}

              {orderDetailModal.notes && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                  <p className="font-semibold text-gray-900">Notes</p>
                  <p className="mt-2 text-gray-600">{orderDetailModal.notes}</p>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Download invoice
                </button>
                {orderDetailModal.trackingNumber && (
                  <button
                    type="button"
                    onClick={() => handleTrackOrder(orderDetailModal)}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
                  >
                    Track shipment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
