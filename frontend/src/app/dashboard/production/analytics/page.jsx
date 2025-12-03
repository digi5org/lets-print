"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeCustomers: 0,
    avgOrderValue: 0,
    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0,
    avgChange: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState({
    completed: 0,
    processing: 0,
    printing: 0,
    pending: 0,
  });

  const fetchAnalytics = async () => {
    if (!token) return;

    // Store token for API calls
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }

    try {
      setLoading(true);
      
      const [productionStats, revenueChart] = await Promise.all([
        api.get("/api/dashboard/production/stats"),
        api.get("/api/dashboard/production/revenue-chart"),
      ]);

      // Calculate stats
      const totalRevenue = productionStats.monthlyRevenue || 0;
      const totalOrders = productionStats.totalOrders || 0;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      setStats({
        totalRevenue,
        totalOrders,
        activeCustomers: 0, // We'll need to add this endpoint later
        avgOrderValue,
        revenueChange: productionStats.revenueChange || 0,
        ordersChange: 0,
        customersChange: 0,
        avgChange: 0,
      });

      setRevenueData(revenueChart);
      
      setOrderStatusData({
        completed: productionStats.completedToday || 0,
        processing: Math.floor(productionStats.inProgress / 2) || 0,
        printing: Math.ceil(productionStats.inProgress / 2) || 0,
        pending: productionStats.jobsInQueue || 0,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, selectedPeriod]);

  const formatCurrency = (amount) => {
    return `৳${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-4xl">💰</div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              stats.revenueChange >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange}%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-4xl">📦</div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              stats.ordersChange >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {stats.ordersChange >= 0 ? '+' : ''}{stats.ordersChange}%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-4xl">👥</div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              -
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Active Customers</p>
          <p className="text-2xl font-bold text-gray-900">{stats.activeCustomers}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-4xl">📊</div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              -
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Avg. Order Value</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.avgOrderValue)}</p>
        </div>
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
        {revenueData.length > 0 ? (
          <div className="h-80 flex items-end justify-between gap-1">
            {revenueData.map((data, index) => {
              const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
              const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full">
                    <div 
                      className="w-full bg-cyan-500 rounded-t-lg hover:bg-cyan-600 transition-colors cursor-pointer" 
                      style={{ height: `${height * 2.5}px`, minHeight: data.revenue > 0 ? '10px' : '0px' }}
                    >
                      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        <div className="font-semibold">{formatCurrency(data.revenue)}</div>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{data.month}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            No revenue data available
          </div>
        )}
      </div>

      {/* Two Column Layout - Removed static products and customers */}
      
      {/* Order Status Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {orderStatusData.completed}
            </div>
            <p className="text-sm font-semibold text-gray-900">Completed</p>
            <p className="text-xs text-gray-500">Today</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-2xl font-bold">
              {orderStatusData.processing}
            </div>
            <p className="text-sm font-semibold text-gray-900">Processing</p>
            <p className="text-xs text-gray-500">In queue</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {orderStatusData.printing}
            </div>
            <p className="text-sm font-semibold text-gray-900">Printing</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-3 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-2xl font-bold">
              {orderStatusData.pending}
            </div>
            <p className="text-sm font-semibold text-gray-900">Pending</p>
            <p className="text-xs text-gray-500">Waiting</p>
          </div>
        </div>
      </div>
    </div>
  );
}
