"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function BillingPage() {
  const { token } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customer: "",
    amount: "",
    description: "",
    dueDate: "",
  });
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    paidThisMonth: 0,
    overdueAmount: 0,
    pendingCount: 0,
    overdueCount: 0,
  });
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    if (token) {
      fetchBillingData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, selectedPeriod]);

  const fetchBillingData = async () => {
    if (!token) return;

    // Store token for API calls
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }

    try {
      setLoading(true);

      // Fetch orders (completed orders are invoices)
      const ordersResponse = await api.get("/api/dashboard/production/recent-jobs?limit=50");
      const ordersData = ordersResponse.data || ordersResponse; // Handle both wrapped and unwrapped responses
      
      // Transform orders to invoices
      const invoiceList = ordersData.map((order) => ({
        id: `INV-${order.id.substring(0, 8).toUpperCase()}`,
        orderId: order.id,
        customer: order.customer || "Unknown",
        amount: order.total || 0,
        status: getInvoiceStatus(order.status, order.date),
        date: order.date,
        dueDate: order.dueDate,
      }));

      setInvoices(invoiceList);

      // Calculate stats
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      let totalRevenue = 0;
      let pendingAmount = 0;
      let paidThisMonth = 0;
      let overdueAmount = 0;
      let pendingCount = 0;
      let overdueCount = 0;

      invoiceList.forEach((invoice) => {
        const invoiceDate = new Date(invoice.date);
        const dueDate = new Date(invoice.dueDate);

        if (invoice.status === "Paid") {
          totalRevenue += invoice.amount;
          if (invoiceDate >= startOfMonth) {
            paidThisMonth += invoice.amount;
          }
        } else if (invoice.status === "Pending") {
          pendingAmount += invoice.amount;
          pendingCount++;
        } else if (invoice.status === "Overdue") {
          overdueAmount += invoice.amount;
          overdueCount++;
        }
      });

      setStats({
        totalRevenue,
        pendingAmount,
        paidThisMonth,
        overdueAmount,
        pendingCount,
        overdueCount,
      });

      // Fetch revenue chart data
      const revenueChartResponse = await api.get("/api/dashboard/production/revenue-chart");
      const revenueChart = revenueChartResponse.data || revenueChartResponse; // Handle both wrapped and unwrapped responses
      setRevenueData(revenueChart);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching billing data:", error);
      toast.error("Failed to load billing data");
      setLoading(false);
    }
  };

  const getInvoiceStatus = (orderStatus, orderDate) => {
    if (orderStatus === "COMPLETED") {
      return "Paid";
    }
    
    const dueDate = new Date(orderDate);
    dueDate.setDate(dueDate.getDate() + 14); // 14 days payment term
    
    if (new Date() > dueDate && orderStatus !== "COMPLETED") {
      return "Overdue";
    }
    
    return "Pending";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatCurrency = (amount) => {
    return `৳${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDownloadInvoice = (invoice) => {
    toast.success(`Downloading invoice ${invoice.id}`);
    // TODO: Implement PDF download
  };

  const handleViewInvoice = (invoice) => {
    toast(`Viewing invoice ${invoice.id}`, {
      icon: "👁️",
    });
    // TODO: Open invoice detail modal
  };

  const handleNewInvoice = () => {
    setFormData({
      customer: "",
      amount: "",
      description: "",
      dueDate: "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) return;

    // Store token for API calls
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }

    // Show message that manual invoice creation is not available for production users
    toast.error("Production users cannot create manual invoices. Invoices are automatically generated from completed orders.");
    setShowModal(false);
    
    // Note: In a production environment, invoices should be generated automatically
    // from completed orders rather than created manually. If you need to create
    // invoices manually, consider:
    // 1. Adding 'create_order' permission to production_owner role, or
    // 2. Creating a dedicated invoice API endpoint with appropriate permissions
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Billing</h1>
            <p className="text-green-100">
              Manage invoices and payment records
            </p>
          </div>
          <button 
            onClick={handleNewInvoice}
            className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Invoice
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-4xl">💰</div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-xs text-gray-500">All time</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-4xl">📄</div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Pending Invoices</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(stats.pendingAmount)}</p>
          <p className="text-xs text-gray-500">{stats.pendingCount} invoices</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-4xl">✅</div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Paid This Month</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(stats.paidThisMonth)}</p>
          <p className="text-xs text-gray-500">Current month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-4xl">⚠️</div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Outstanding</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(stats.overdueAmount)}</p>
          <p className="text-xs text-gray-500">{stats.overdueCount} overdue</p>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Invoice History</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPeriod("week")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedPeriod === "week"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setSelectedPeriod("month")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedPeriod === "month"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setSelectedPeriod("year")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedPeriod === "year"
                  ? "bg-green-600 text-white"
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
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Revenue</h2>
        {revenueData.length > 0 ? (
          <div className="h-64 flex items-end justify-between gap-2">
            {revenueData.map((data, index) => {
              const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
              const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full">
                    <div 
                      className="w-full bg-green-500 rounded-t-lg hover:bg-green-600 transition-colors cursor-pointer" 
                      style={{ height: `${height * 2}px`, minHeight: data.revenue > 0 ? '10px' : '0px' }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {formatCurrency(data.revenue)}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{data.month}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No revenue data available
          </div>
        )}
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
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
              {invoices.length > 0 ? (
                invoices.slice(0, 10).map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.customer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{formatCurrency(invoice.amount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.dueDate ? formatDate(invoice.dueDate) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Download
                      </button>
                      <button 
                        onClick={() => handleViewInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium text-gray-900 mb-1">No invoices yet</p>
                      <p className="text-sm text-gray-500">Invoices will appear here once orders are completed</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create New Invoice</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter customer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (৳)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Invoice description (optional)"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
