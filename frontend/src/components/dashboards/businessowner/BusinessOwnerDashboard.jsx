'use client';

import React from 'react';
export default function BusinessOwnerDashboard({ userName }) {
  return (
    <div className="">
      {/* View header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {userName || 'John'}! Here is what is happening today.</p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
          </svg>
          New Order
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v4H3zM3 13h18v8H3z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Total Orders</p>
              <div className="text-2xl font-bold">342</div>
              <div className="text-xs text-green-600 mt-1">+12% from last month</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3"/></svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Active Projects</p>
              <div className="text-2xl font-bold">28</div>
              <div className="text-xs text-green-600 mt-1">+5% increase</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2"/></svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <div className="text-2xl font-bold">$48,352</div>
              <div className="text-xs text-green-600 mt-1">+18% from last month</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7"/></svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Profit Margin</p>
              <div className="text-2xl font-bold">32.4%</div>
              <div className="text-xs text-green-600 mt-1">+2.1% increase</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts / analytics removed as requested */}

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <a href="/dashboard/business/orders" className="text-sm text-blue-600">View All</a>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-3">Order ID</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Product</th>
                <th className="py-3">Date</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Status</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4].map(i => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-3"><span className="font-mono text-xs">#ORD-{1230 + i}</span></td>
                  <td className="py-3">Customer {i}</td>
                  <td className="py-3">Product Sample</td>
                  <td className="py-3">Oct {20+i}, 2025</td>
                  <td className="py-3 font-semibold">${(200 + i*50).toFixed(2)}</td>
                  <td className="py-3"><span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">Pending</span></td>
                  <td className="py-3"><button className="text-sm text-blue-600">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

