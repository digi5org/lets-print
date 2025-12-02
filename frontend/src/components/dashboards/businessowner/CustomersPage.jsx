"use client";

import React from "react";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers & Leads</h1>
          <p className="text-gray-600">Manage your customer relationships</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
          </svg>
          Add Customer
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total Customers</div>
          <div className="text-2xl font-bold">1,248</div>
          <div className="text-xs text-green-600">+12% this month</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Active Leads</div>
          <div className="text-2xl font-bold">42</div>
          <div className="text-xs text-gray-600">8 new this week</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Avg. Customer Value</div>
          <div className="text-2xl font-bold">$2,450</div>
          <div className="text-xs text-green-600">+8% increase</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Retention Rate</div>
          <div className="text-2xl font-bold">89%</div>
          <div className="text-xs text-green-600">+3% improvement</div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Customer List</h3>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Search customers..." className="px-3 py-2 border rounded text-sm" />
            <select className="px-3 py-2 border rounded text-sm">
              <option>All Customers</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>VIP</option>
            </select>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="p-3">Customer</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Total Spend</th>
                <th className="p-3">Orders</th>
                <th className="p-3">Last Contact</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4].map(i => (
                <tr key={i} className="border-b">
                  <td className="p-3">Customer {i}</td>
                  <td className="p-3">customer{i}@example.com</td>
                  <td className="p-3">+1 (555) 12{i} - 34</td>
                  <td className="p-3">${(1000 + i*200).toFixed(2)}</td>
                  <td className="p-3">{2 + i}</td>
                  <td className="p-3">Oct {10+i}, 2025</td>
                  <td className="p-3"><span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">Active</span></td>
                  <td className="p-3"><button className="text-blue-600 text-sm">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
