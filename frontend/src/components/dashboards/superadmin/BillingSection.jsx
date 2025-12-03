"use client";

import { useState } from "react";

export default function BillingSection() {
  const [activeTab, setActiveTab] = useState("overview");

  const billingStats = {
    totalRevenue: 125430,
    monthlyRecurring: 8750,
    pendingPayments: 2340,
    overduePayments: 890,
  };

  const subscriptionPlans = [
    { name: "Basic", price: 29, subscribers: 45, revenue: 1305 },
    { name: "Professional", price: 99, subscribers: 28, revenue: 2772 },
    { name: "Enterprise", price: 299, subscribers: 12, revenue: 3588 },
  ];

  const recentTransactions = [
    { id: "TXN001", customer: "Acme Corp", amount: 299, status: "completed", date: "2024-12-02", plan: "Enterprise" },
    { id: "TXN002", customer: "Tech Solutions", amount: 99, status: "completed", date: "2024-12-01", plan: "Professional" },
    { id: "TXN003", customer: "PrintHub", amount: 29, status: "pending", date: "2024-12-01", plan: "Basic" },
    { id: "TXN004", customer: "Design Studio", amount: 99, status: "completed", date: "2024-11-30", plan: "Professional" },
    { id: "TXN005", customer: "Local Print", amount: 29, status: "failed", date: "2024-11-30", plan: "Basic" },
  ];

  const invoices = [
    { id: "INV-2024-001", customer: "Acme Corp", amount: 299, status: "paid", dueDate: "2024-12-15" },
    { id: "INV-2024-002", customer: "Tech Solutions", amount: 99, status: "paid", dueDate: "2024-12-10" },
    { id: "INV-2024-003", customer: "PrintHub", amount: 29, status: "pending", dueDate: "2024-12-20" },
    { id: "INV-2024-004", customer: "Design Studio", amount: 99, status: "overdue", dueDate: "2024-11-25" },
  ];

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-600 mt-1">Manage subscriptions, invoices, and payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(billingStats.totalRevenue)}</p>
          <p className="text-xs text-green-600 mt-1">+15% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Monthly Recurring</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(billingStats.monthlyRecurring)}</p>
          <p className="text-xs text-blue-600 mt-1">85 active subscriptions</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Pending Payments</p>
          <p className="text-2xl font-bold text-yellow-600">{formatCurrency(billingStats.pendingPayments)}</p>
          <p className="text-xs text-gray-500 mt-1">12 pending invoices</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(billingStats.overduePayments)}</p>
          <p className="text-xs text-red-600 mt-1">3 overdue invoices</p>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {["overview", "subscriptions", "invoices", "transactions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plans</h2>
            <div className="space-y-4">
              {subscriptionPlans.map((plan) => (
                <div key={plan.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{plan.name}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(plan.price)}/month</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{plan.subscribers} subscribers</p>
                    <p className="text-sm text-green-600">{formatCurrency(plan.revenue)}/mo</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
            <div className="space-y-3">
              {recentTransactions.slice(0, 5).map((txn) => (
                <div key={txn.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{txn.customer}</p>
                    <p className="text-xs text-gray-500">
                      {txn.id} • {txn.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(txn.amount)}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        txn.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : txn.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "subscriptions" && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscribers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Revenue</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subscriptionPlans.map((plan) => (
                <tr key={plan.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{plan.name}</td>
                  <td className="px-6 py-4 text-gray-600">{formatCurrency(plan.price)}/month</td>
                  <td className="px-6 py-4 text-gray-600">{plan.subscribers}</td>
                  <td className="px-6 py-4 text-green-600 font-medium">{formatCurrency(plan.revenue)}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "invoices" && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{invoice.id}</td>
                  <td className="px-6 py-4 text-gray-600">{invoice.customer}</td>
                  <td className="px-6 py-4 text-gray-900">{formatCurrency(invoice.amount)}</td>
                  <td className="px-6 py-4 text-gray-600">{invoice.dueDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : invoice.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">View</button>
                    <button className="text-gray-600 hover:text-gray-800">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "transactions" && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{txn.id}</td>
                  <td className="px-6 py-4 text-gray-600">{txn.customer}</td>
                  <td className="px-6 py-4 text-gray-600">{txn.plan}</td>
                  <td className="px-6 py-4 text-gray-900">{formatCurrency(txn.amount)}</td>
                  <td className="px-6 py-4 text-gray-600">{txn.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        txn.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : txn.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
