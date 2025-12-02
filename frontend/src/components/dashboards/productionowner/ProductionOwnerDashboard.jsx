"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ApiClient } from "@/lib/apiClient";
import toast from "react-hot-toast";

export default function ProductionOwnerDashboard({ userName }) {
  const { token } = useAuth();
  const [orderDetailModal, setOrderDetailModal] = useState(null);
  const [stats, setStats] = useState({
    jobsInQueue: 0,
    inProgress: 0,
    completedToday: 0,
    completedYesterday: 0,
    monthlyRevenue: 0,
    revenueChange: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [revenueChart, setRevenueChart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const apiClient = new ApiClient(token);

      const [statsRes, jobsRes, activeJobRes, chartRes] = await Promise.all([
        apiClient.get("/api/dashboard/production/stats"),
        apiClient.get("/api/dashboard/production/recent-jobs?limit=5"),
        apiClient.get("/api/dashboard/production/active-job"),
        apiClient.get("/api/dashboard/production/revenue-chart"),
      ]);

      if (statsRes.success) {
        console.log('Stats data:', statsRes.data);
        setStats(statsRes.data);
      } else {
        console.error('Stats fetch failed:', statsRes);
      }

      if (jobsRes.success) {
        console.log('Jobs data:', jobsRes.data);
        setRecentJobs(jobsRes.data);
      }

      if (activeJobRes.success) {
        console.log('Active job data:', activeJobRes.data);
        setActiveJob(activeJobRes.data);
      }

      if (chartRes.success) {
        console.log('Chart data:', chartRes.data);
        setRevenueChart(chartRes.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      console.error("Error details:", error.message, error.response);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token, fetchDashboardData]);

  const statsData = [
    { 
      name: "Jobs in Queue", 
      value: stats.jobsInQueue?.toString() || "0", 
      change: "Pending orders", 
      changeType: "positive",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: "blue"
    },
    { 
      name: "In Progress", 
      value: stats.inProgress?.toString() || "0", 
      change: "Currently active", 
      changeType: "positive",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "purple"
    },
    { 
      name: "Completed Today", 
      value: stats.completedToday?.toString() || "0", 
      change: `${stats.completedYesterday || 0} yesterday`, 
      changeType: stats.completedToday >= stats.completedYesterday ? "positive" : "warning",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "green"
    },
    { 
      name: "Monthly Revenue", 
      value: `$${stats.monthlyRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`, 
      change: `${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange}% this month`, 
      changeType: stats.revenueChange >= 0 ? "positive" : "warning",
      subtext: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "orange"
    },
  ];

  const handleViewJob = (job) => {
    setOrderDetailModal(job);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Header with Actions */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 rounded-xl shadow-sm p-8 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {userName?.split(' ')[0] || 'Production Owner'}!</h1>
            <p className="text-purple-100">
              Here&apos;s your production overview and job queue
            </p>
          </div>
          <div className="hidden md:flex gap-3">
            <button 
              onClick={() => window.location.href = '/dashboard/production/orders'}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Analytics
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard/production/orders'}
              className="bg-white text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Job
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {statsData.map((stat) => (
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
              <h2 className="text-xl font-semibold text-gray-900">Recent Jobs</h2>
              <a 
                href="/dashboard/production"
                className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            <div className="grid gap-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => handleViewJob(job)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-3xl">🏭</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">{job.title}</p>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              job.status === "COMPLETED"
                                ? "bg-green-100 text-green-700"
                                : job.status === "PRINTING"
                                ? "bg-blue-100 text-blue-700"
                                : job.status === "PROCESSING"
                                ? "bg-yellow-100 text-yellow-700"
                                : job.status === "PENDING"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {job.status}
                          </span>
                          {job.priority && (
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                job.priority === "High"
                                  ? "bg-red-100 text-red-700"
                                  : job.priority === "Medium"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {job.priority}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{job.id.substring(0, 8)} • {job.quantity} • Due: {job.dueDate ? formatDate(job.dueDate) : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-lg">{formatCurrency(job.total)}</p>
                      <p className="text-xs text-gray-500">{formatDate(job.date)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Job Status */}
          {activeJob && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Job Status</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Job ID: <span className="font-semibold text-gray-900">{activeJob.id.substring(0, 8)}</span></p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{activeJob.title}</p>
                    <p className="text-sm text-gray-500 mt-1">Customer: {activeJob.customer}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                    {activeJob.status}
                  </span>
                </div>
                
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                  <div className="space-y-6 relative">
                    {activeJob.timeline.map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 flex-shrink-0 ${
                          step.completed 
                            ? 'bg-green-500' 
                            : step.active 
                            ? 'bg-purple-500 animate-pulse' 
                            : 'bg-gray-300'
                        }`}>
                          {step.completed ? (
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 pt-1">
                          <p className={`text-sm ${
                            step.completed || step.active 
                              ? 'font-semibold text-gray-900' 
                              : 'font-medium text-gray-400'
                          }`}>{step.step}</p>
                          <p className={`text-xs ${
                            step.active 
                              ? 'text-purple-600 font-medium' 
                              : step.completed 
                              ? 'text-gray-500' 
                              : 'text-gray-400'
                          }`}>
                            {step.active ? 'In progress...' : step.timestamp ? formatDateTime(step.timestamp) : 'Pending'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Production Overview Chart */}
          <div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Production Revenue</h2>
              <div className="h-64 flex items-end justify-between gap-2">
                {revenueChart.length > 0 ? (
                  revenueChart.map((data, index) => {
                    const maxRevenue = Math.max(...revenueChart.map(d => d.revenue));
                    const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 200 : 20;
                    return (
                      <div key={data.month} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="relative w-full">
                          <div 
                            className="w-full bg-purple-500 rounded-t-lg hover:bg-purple-600 transition-colors cursor-pointer" 
                            style={{ height: `${height}px` }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {formatCurrency(data.revenue)}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{data.month}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full flex items-center justify-center text-gray-400">
                    <p>No revenue data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      {orderDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Job Details</h2>
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
                  <p className="text-sm text-gray-500">Job ID</p>
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
                  <p className="text-sm text-gray-500">Received</p>
                  <p className="text-sm font-semibold text-gray-900">{orderDetailModal.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="text-sm font-semibold text-gray-900">{orderDetailModal.dueDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="text-sm font-semibold text-gray-900">{orderDetailModal.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-base font-semibold text-gray-900">{orderDetailModal.total}</p>
                </div>
                {orderDetailModal.priority && (
                  <div>
                    <p className="text-sm text-gray-500">Priority</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        orderDetailModal.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : orderDetailModal.priority === "Medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {orderDetailModal.priority}
                    </span>
                  </div>
                )}
              </div>

              {orderDetailModal.notes && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                  <p className="font-semibold text-gray-900">Notes</p>
                  <p className="mt-2 text-gray-600">{orderDetailModal.notes}</p>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                >
                  Update Status
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-purple-500 hover:text-purple-600"
                >
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
