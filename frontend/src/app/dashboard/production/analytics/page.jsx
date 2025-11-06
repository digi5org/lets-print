"use client";

import { useState } from "react";

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const stats = [
    { label: "Total Revenue", value: "$185,450", change: "+12.5%", icon: "💰", trend: "up" },
    { label: "Total Orders", value: "1,248", change: "+8.2%", icon: "📦", trend: "up" },
    { label: "Active Customers", value: "342", change: "+15.3%", icon: "👥", trend: "up" },
    { label: "Avg. Order Value", value: "$148", change: "-2.1%", icon: "📊", trend: "down" },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 12500, orders: 85 },
    { month: 'Feb', revenue: 15800, orders: 102 },
    { month: 'Mar', revenue: 14200, orders: 95 },
    { month: 'Apr', revenue: 18900, orders: 128 },
    { month: 'May', revenue: 17600, orders: 115 },
    { month: 'Jun', revenue: 21300, orders: 145 },
    { month: 'Jul', revenue: 19400, orders: 132 },
    { month: 'Aug', revenue: 23100, orders: 156 },
    { month: 'Sep', revenue: 20800, orders: 140 },
    { month: 'Oct', revenue: 24500, orders: 165 },
    { month: 'Nov', revenue: 26700, orders: 178 },
  ];

  const topProducts = [
    { name: "Business Cards", orders: 456, revenue: "$22,800", percentage: 32 },
    { name: "Brochures", orders: 289, revenue: "$18,450", percentage: 25 },
    { name: "Flyers", orders: 234, revenue: "$12,200", percentage: 18 },
    { name: "Banners", orders: 145, revenue: "$28,900", percentage: 15 },
    { name: "Posters", orders: 124, revenue: "$9,640", percentage: 10 },
  ];

  const topCustomers = [
    { name: "ABC Corp", orders: 45, revenue: "$18,450", avatar: "🏢" },
    { name: "XYZ Inc", orders: 38, revenue: "$15,200", avatar: "🏭" },
    { name: "Tech Start", orders: 32, revenue: "$12,800", avatar: "💻" },
    { name: "Marketing Pro", orders: 28, revenue: "$9,240", avatar: "📱" },
    { name: "Design Studio", orders: 24, revenue: "$8,640", avatar: "🎨" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-800 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
            <p className="text-cyan-100">
              Track performance and business insights
            </p>
          </div>
          <div className="flex gap-2">
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-4xl">{stat.icon}</div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Revenue & Orders Overview</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPeriod("week")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedPeriod === "week"
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setSelectedPeriod("month")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedPeriod === "month"
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setSelectedPeriod("year")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedPeriod === "year"
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Revenue Trend</h2>
        <div className="h-80 flex items-end justify-between gap-1">
          {revenueData.map((data, index) => {
            const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
            const height = (data.revenue / maxRevenue) * 100;
            return (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative w-full">
                  <div 
                    className="w-full bg-cyan-500 rounded-t-lg hover:bg-cyan-600 transition-colors cursor-pointer" 
                    style={{ height: `${height * 2.5}px` }}
                  >
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      <div className="font-semibold">${(data.revenue / 1000).toFixed(1)}K</div>
                      <div className="text-gray-300">{data.orders} orders</div>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{data.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center text-sm font-bold text-cyan-700">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.orders} orders</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{product.revenue}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-cyan-600 h-2 rounded-full"
                    style={{ width: `${product.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Customers</h2>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div key={customer.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center text-2xl">
                    {customer.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{customer.name}</p>
                    <p className="text-xs text-gray-500">{customer.orders} orders</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900">{customer.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              156
            </div>
            <p className="text-sm font-semibold text-gray-900">Completed</p>
            <p className="text-xs text-gray-500">68% of total</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-2xl font-bold">
              45
            </div>
            <p className="text-sm font-semibold text-gray-900">In Progress</p>
            <p className="text-xs text-gray-500">20% of total</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              18
            </div>
            <p className="text-sm font-semibold text-gray-900">Quality Check</p>
            <p className="text-xs text-gray-500">8% of total</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-3 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-2xl font-bold">
              9
            </div>
            <p className="text-sm font-semibold text-gray-900">Pending</p>
            <p className="text-xs text-gray-500">4% of total</p>
          </div>
        </div>
      </div>
    </div>
  );
}
