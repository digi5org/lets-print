"use client";

import { useState } from "react";

export default function BillingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const billingStats = [
    { label: "Total Revenue", value: "$18,450", change: "+12%", icon: "💰", color: "green" },
    { label: "Pending Invoices", value: "$3,200", change: "5 invoices", icon: "📄", color: "yellow" },
    { label: "Paid This Month", value: "$15,250", change: "+8%", icon: "✅", color: "blue" },
    { label: "Outstanding", value: "$950", change: "2 overdue", icon: "⚠️", color: "red" },
  ];

  const recentInvoices = [
    {
      id: "INV-001",
      customer: "ABC Corp",
      amount: "$450.00",
      status: "Paid",
      date: "Nov 5, 2025",
      dueDate: "Nov 5, 2025",
    },
    {
      id: "INV-002",
      customer: "XYZ Inc",
      amount: "$850.00",
      status: "Pending",
      date: "Nov 4, 2025",
      dueDate: "Nov 19, 2025",
    },
    {
      id: "INV-003",
      customer: "Tech Start",
      amount: "$1,200.00",
      status: "Paid",
      date: "Nov 3, 2025",
      dueDate: "Nov 3, 2025",
    },
    {
      id: "INV-004",
      customer: "Marketing Pro",
      amount: "$320.00",
      status: "Overdue",
      date: "Oct 28, 2025",
      dueDate: "Nov 3, 2025",
    },
    {
      id: "INV-005",
      customer: "Design Studio",
      amount: "$680.00",
      status: "Pending",
      date: "Nov 2, 2025",
      dueDate: "Nov 17, 2025",
    },
  ];

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
          <button className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Invoice
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {billingStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-4xl">{stat.icon}</div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.change}</p>
          </div>
        ))}
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
        <div className="h-64 flex items-end justify-between gap-2">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((month, index) => {
            const heights = [45, 60, 52, 75, 68, 85, 72, 88, 65, 78, 92];
            const amounts = ['$2,800', '$3,900', '$3,400', '$5,200', '$4,800', '$6,500', '$5,100', '$7,200', '$4,500', '$6,100', '$7,800'];
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative w-full">
                  <div 
                    className="w-full bg-green-500 rounded-t-lg hover:bg-green-600 transition-colors cursor-pointer" 
                    style={{ height: `${heights[index] * 2}px` }}
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
              {recentInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invoice.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{invoice.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900 mr-3">Download</button>
                    <button className="text-blue-600 hover:text-blue-900">View</button>
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
