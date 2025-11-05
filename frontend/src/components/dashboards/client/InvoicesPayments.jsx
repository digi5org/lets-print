"use client";

import { useState } from "react";

export default function InvoicesPayments({ onBack }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'paid', 'overdue'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Mock invoices data
  const invoices = [
    {
      id: "INV-2024-1023",
      orderId: "ORD-1023",
      date: "Dec 10, 2024",
      dueDate: "Dec 24, 2024",
      amount: 450.00,
      status: "pending",
      items: [
        { description: "Business Cards - Premium Finish", quantity: 500, unitPrice: 0.80, total: 400.00 },
        { description: "Gold Foil Upgrade", quantity: 1, unitPrice: 50.00, total: 50.00 }
      ],
      subtotal: 450.00,
      tax: 0.00,
      total: 450.00,
      customer: {
        name: "Sarah Mitchell",
        email: "sarah@example.com",
        address: "123 Business St, New York, NY 10001"
      }
    },
    {
      id: "INV-2024-1018",
      orderId: "ORD-1018",
      date: "Dec 8, 2024",
      dueDate: "Dec 22, 2024",
      amount: 320.00,
      status: "pending",
      items: [
        { description: "Flyers - 500pc", quantity: 500, unitPrice: 0.64, total: 320.00 }
      ],
      subtotal: 320.00,
      tax: 0.00,
      total: 320.00,
      customer: {
        name: "Sarah Mitchell",
        email: "sarah@example.com",
        address: "123 Business St, New York, NY 10001"
      }
    },
    {
      id: "INV-2024-1015",
      orderId: "ORD-1015",
      date: "Dec 5, 2024",
      dueDate: "Dec 19, 2024",
      amount: 180.00,
      status: "paid",
      paidDate: "Dec 6, 2024",
      paymentMethod: "Credit Card",
      items: [
        { description: "Banner - 6' x 3'", quantity: 3, unitPrice: 60.00, total: 180.00 }
      ],
      subtotal: 180.00,
      tax: 0.00,
      total: 180.00,
      customer: {
        name: "Sarah Mitchell",
        email: "sarah@example.com",
        address: "123 Business St, New York, NY 10001"
      }
    },
    {
      id: "INV-2024-1012",
      orderId: "ORD-1012",
      date: "Dec 1, 2024",
      dueDate: "Dec 15, 2024",
      amount: 290.00,
      status: "paid",
      paidDate: "Dec 2, 2024",
      paymentMethod: "PayPal",
      items: [
        { description: "Brochures - Tri-Fold", quantity: 200, unitPrice: 1.45, total: 290.00 }
      ],
      subtotal: 290.00,
      tax: 0.00,
      total: 290.00,
      customer: {
        name: "Sarah Mitchell",
        email: "sarah@example.com",
        address: "123 Business St, New York, NY 10001"
      }
    },
    {
      id: "INV-2024-1005",
      orderId: "ORD-1005",
      date: "Nov 20, 2024",
      dueDate: "Dec 4, 2024",
      amount: 125.00,
      status: "overdue",
      items: [
        { description: "Stickers - Custom Die Cut", quantity: 250, unitPrice: 0.50, total: 125.00 }
      ],
      subtotal: 125.00,
      tax: 0.00,
      total: 125.00,
      customer: {
        name: "Sarah Mitchell",
        email: "sarah@example.com",
        address: "123 Business St, New York, NY 10001"
      }
    },
  ];

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || invoice.status === activeTab;
    return matchesSearch && matchesTab;
  });

  // Calculate totals
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  const handlePayInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentModalOpen(true);
  };

  const handleConfirmPayment = () => {
    console.log("Processing payment for:", selectedInvoice.id, "via", paymentMethod);
    // In production, this would process the payment
    setPaymentModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleDownloadInvoice = (invoice) => {
    console.log("Downloading invoice:", invoice.id);
    // In production, this would generate and download PDF
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="font-medium">Back to Dashboard</span>
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-teal-800 rounded-xl shadow-sm p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Invoices & Payments</h1>
            <p className="text-green-100">
              Manage your invoices and payment history
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4">
              <p className="text-green-100 text-sm mb-1">Total Outstanding</p>
              <p className="text-3xl font-bold">${(pendingAmount + overdueAmount).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Invoices</p>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">{invoices.length} invoices</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Paid</p>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">${paidAmount.toFixed(2)}</p>
          <p className="text-xs text-green-600 mt-1">{invoices.filter(i => i.status === 'paid').length} paid</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Pending</p>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">${pendingAmount.toFixed(2)}</p>
          <p className="text-xs text-yellow-600 mt-1">{invoices.filter(i => i.status === 'pending').length} pending</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Overdue</p>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">${overdueAmount.toFixed(2)}</p>
          <p className="text-xs text-red-600 mt-1">{invoices.filter(i => i.status === 'overdue').length} overdue</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by invoice or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All Invoices', count: invoices.length },
            { id: 'pending', label: 'Pending', count: invoices.filter(i => i.status === 'pending').length },
            { id: 'paid', label: 'Paid', count: invoices.filter(i => i.status === 'paid').length },
            { id: 'overdue', label: 'Overdue', count: invoices.filter(i => i.status === 'overdue').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                activeTab === tab.id
                  ? 'bg-white text-green-600'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {invoice.id}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{invoice.orderId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{invoice.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{invoice.dueDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">${invoice.amount.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleDownloadInvoice(invoice)}
                      className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                    >
                      Download
                    </button>
                    {invoice.status !== 'paid' && (
                      <button
                        onClick={() => handlePayInvoice(invoice)}
                        className="text-sm text-green-600 hover:text-green-800 font-medium"
                      >
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-gray-500 text-lg">No invoices found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && !paymentModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Invoice Details</h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedInvoice.id}</h2>
                  <p className="text-sm text-gray-600">Order: {selectedInvoice.orderId}</p>
                  <p className="text-sm text-gray-600">Date: {selectedInvoice.date}</p>
                  <p className="text-sm text-gray-600">Due: {selectedInvoice.dueDate}</p>
                </div>
                <span className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                  {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                </span>
              </div>

              {/* Bill To */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Bill To:</h4>
                <p className="text-gray-900 font-medium">{selectedInvoice.customer.name}</p>
                <p className="text-sm text-gray-600">{selectedInvoice.customer.email}</p>
                <p className="text-sm text-gray-600">{selectedInvoice.customer.address}</p>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Items:</h4>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Description</th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">Qty</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">Unit Price</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-right">${item.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-end mb-2">
                  <div className="w-64">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="text-sm font-semibold text-gray-900">${selectedInvoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Tax:</span>
                      <span className="text-sm font-semibold text-gray-900">${selectedInvoice.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-base font-bold text-gray-900">Total:</span>
                      <span className="text-base font-bold text-gray-900">${selectedInvoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info (if paid) */}
              {selectedInvoice.status === 'paid' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-green-800">Paid</span>
                  </div>
                  <p className="text-sm text-green-700">Paid on {selectedInvoice.paidDate} via {selectedInvoice.paymentMethod}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleDownloadInvoice(selectedInvoice)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </button>
                {selectedInvoice.status !== 'paid' && (
                  <button
                    onClick={() => handlePayInvoice(selectedInvoice)}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Pay Now - ${selectedInvoice.total.toFixed(2)}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="border-b border-gray-200 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Payment</h3>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Amount */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
                <p className="text-sm text-green-700 mb-1">Amount to Pay</p>
                <p className="text-3xl font-bold text-green-900">${selectedInvoice.total.toFixed(2)}</p>
                <p className="text-xs text-green-600 mt-1">Invoice: {selectedInvoice.id}</p>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                <div className="space-y-2">
                  {[
                    { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
                    { id: 'paypal', label: 'PayPal', icon: '🅿️' },
                    { id: 'bank', label: 'Bank Transfer', icon: '🏦' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                        paymentMethod === method.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-medium text-gray-900">{method.label}</span>
                      {paymentMethod === method.id && (
                        <svg className="w-5 h-5 text-green-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPayment}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
