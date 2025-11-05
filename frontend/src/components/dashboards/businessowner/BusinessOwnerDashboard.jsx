"use client";

import { useState } from "react";

export default function BusinessOwnerDashboard({ userName }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const stats = [
    { 
      name: "Total Orders", 
      value: "342", 
      change: "12% from last month",
      changeType: "positive",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "blue"
    },
    { 
      name: "Active Projects", 
      value: "28", 
      change: "5% increase",
      changeType: "positive",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "orange"
    },
    { 
      name: "Total Revenue", 
      value: "$48,352", 
      change: "18% from last month",
      changeType: "positive",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "green"
    },
    { 
      name: "Profit Margin", 
      value: "32.4%", 
      change: "2.1% increase",
      changeType: "positive",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: "purple"
    },
    { 
      name: "Pending Approvals", 
      value: "12", 
      change: "Requires attention",
      changeType: "warning",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: "orange"
    },
  ];

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };

  const orders = [
    { 
      id: "ORD-101", 
      client: "ABC Corp", 
      product: "Business Cards",
      quantity: "1000",
      status: "Pending", 
      date: "2025-11-02",
      total: "$250.00",
    },
    { 
      id: "ORD-102", 
      client: "XYZ Inc", 
      product: "Brochures",
      quantity: "500",
      status: "In Production", 
      date: "2025-11-01",
      total: "$850.00",
    },
    { 
      id: "ORD-103", 
      client: "Tech Start", 
      product: "Banners",
      quantity: "10",
      status: "Shipped", 
      date: "2025-10-30",
      total: "$420.00",
    },
    { 
      id: "ORD-104", 
      client: "Marketing Pro", 
      product: "Flyers",
      quantity: "2000",
      status: "Completed", 
      date: "2025-10-28",
      total: "$380.00",
    },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {userName.split(' ')[0]}! Here&apos;s what&apos;s happening today.
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Order
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Overview Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Revenue Overview</h2>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-72">
            {/* Revenue Line Chart */}
            <div className="h-full flex flex-col">
              <div className="flex-1 relative">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
                  <span>$50,000</span>
                  <span>$45,000</span>
                  <span>$40,000</span>
                  <span>$35,000</span>
                  <span>$30,000</span>
                  <span>$25,000</span>
                  <span>$20,000</span>
                  <span>$15,000</span>
                  <span>$10,000</span>
                  <span>$5,000</span>
                  <span>$0</span>
                </div>
                {/* Chart area */}
                <div className="ml-16 h-full flex items-end justify-between gap-2">
                  {[
                    { month: 'Jan', value: 65, amount: '$32,500' },
                    { month: 'Feb', value: 70, amount: '$35,000' },
                    { month: 'Mar', value: 68, amount: '$34,000' },
                    { month: 'Apr', value: 75, amount: '$37,500' },
                    { month: 'May', value: 85, amount: '$42,500' },
                    { month: 'Jun', value: 97, amount: '$48,500' }
                  ].map((data) => (
                    <div key={data.month} className="flex-1 flex flex-col items-center gap-2 group relative">
                      <div className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-colors cursor-pointer" 
                           style={{ height: `${data.value}%` }}>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {data.amount}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* X-axis labels */}
              <div className="ml-16 flex items-center justify-between gap-2 mt-3">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month) => (
                  <div key={month} className="flex-1 text-center text-xs text-gray-500 font-medium">
                    {month}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Donut Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status</h2>
          <div className="h-72 flex items-center justify-center">
            {/* Donut Chart */}
            <div className="relative w-64 h-64">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Completed - Green */}
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="20"
                  strokeDasharray="188.5"
                  strokeDashoffset="0"
                  className="transition-all"
                />
                {/* Shipped - Teal */}
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="20"
                  strokeDasharray="141.4 47.1"
                  strokeDashoffset="-47.1"
                  className="transition-all"
                />
                {/* In Production - Blue */}
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="20"
                  strokeDasharray="113.1 75.4"
                  strokeDashoffset="-94.2"
                  className="transition-all"
                />
                {/* Pending - Orange */}
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="20"
                  strokeDasharray="75.4 113.1"
                  strokeDashoffset="-169.6"
                  className="transition-all"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">342</p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
              </div>
            </div>
          </div>
          {/* Legend */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-600">Pending</span>
              </div>
              <span className="font-medium text-gray-900">40</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">In Production</span>
              </div>
              <span className="font-medium text-gray-900">60</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                <span className="text-gray-600">Shipped</span>
              </div>
              <span className="font-medium text-gray-900">75</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Completed</span>
              </div>
              <span className="font-medium text-gray-900">167</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All
          </button>
        </div>
        
        {/* Search and Filter */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex gap-4">
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in production">In Production</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-3xl">📦</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{order.product}</p>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "In Production"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{order.id} • {order.client} • {order.quantity} units</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-lg">{order.total}</p>
                  <p className="text-xs text-gray-500">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
