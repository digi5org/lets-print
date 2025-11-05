"use client";

import { useState } from "react";

export default function ClientDashboard({ userName }) {
  const [orderDetailModal, setOrderDetailModal] = useState(null);

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
  ];

  const handleViewOrder = (order) => {
    setOrderDetailModal(order);
  };

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };

  return (
    <>
      {/* Page Header with Actions */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-xl shadow-sm p-8 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {userName?.split(' ')[0] || 'User'}!</h1>
            <p className="text-blue-100">
              Here&apos;s your order activity and account overview
            </p>
          </div>
          <div className="hidden md:flex gap-3">
            <button 
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
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
              <a 
                href="/dashboard/client"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            <div className="grid gap-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => handleViewOrder(order)}>
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

      {/* Order Detail Modal */}
      {orderDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
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
                  Download Invoice
                </button>
                {orderDetailModal.trackingNumber && (
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
                  >
                    Track Shipment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
