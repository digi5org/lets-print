"use client";

import React from "react";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage all your customer orders</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
          </svg>
          New Order
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 bg-white p-4 rounded shadow">
        <input type="text" placeholder="Search orders..." className="flex-1 px-3 py-2 border rounded-lg text-sm" />
        <select className="px-3 py-2 border rounded-lg text-sm">
          <option>All Statuses</option>
          <option>Pending</option>
          <option>In Production</option>
          <option>Shipped</option>
          <option>Completed</option>
        </select>
        <select className="px-3 py-2 border rounded-lg text-sm">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>Last 3 Months</option>
          <option>All Time</option>
        </select>
        <button className="px-3 py-2 bg-gray-100 rounded-lg text-sm">More Filters</button>
        <button className="px-3 py-2 bg-gray-100 rounded-lg text-sm">Export</button>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="p-3"><input type="checkbox" /></th>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Product</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4].map(i => (
                <tr key={i} className="border-b">
                  <td className="p-3"><input type="checkbox" /></td>
                  <td className="p-3">#ORD-{1200 + i}</td>
                  <td className="p-3">Customer {i}</td>
                  <td className="p-3">Product Sample</td>
                  <td className="p-3">{1 + i}</td>
                  <td className="p-3">Oct {20+i}, 2025</td>
                  <td className="p-3">${(150 + i*40).toFixed(2)}</td>
                  <td className="p-3"><span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">Pending</span></td>
                  <td className="p-3"><button className="text-blue-600 text-sm">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">Showing 1-4 of 42 orders</div>
          <div className="space-x-2">
            <button className="px-3 py-1 bg-gray-100 rounded">Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
