"use client";

import { useState } from "react";

export default function ProductionOwnerDashboard({ userName }) {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const stats = [
    { name: "Jobs in Queue", value: "23", change: "+5", changeType: "positive" },
    { name: "In Progress", value: "12", change: "+3", changeType: "positive" },
    { name: "Completed Today", value: "8", change: "+2", changeType: "positive" },
    { name: "Total Revenue", value: "$8,450", change: "+18%", changeType: "positive" },
  ];

  const jobQueue = [
    { 
      id: "JOB-301", 
      business: "PrintHub Co",
      orderId: "ORD-101",
      product: "Business Cards",
      quantity: "1000",
      priority: "High",
      status: "Pending", 
      submittedDate: "2025-11-02",
      dueDate: "2025-11-05",
      client: "ABC Corp"
    },
    { 
      id: "JOB-302", 
      business: "QuickPrint Inc",
      orderId: "ORD-205",
      product: "Brochures",
      quantity: "500",
      priority: "Medium",
      status: "In Progress", 
      submittedDate: "2025-11-01",
      dueDate: "2025-11-04",
      client: "XYZ Inc"
    },
    { 
      id: "JOB-303", 
      business: "PrintHub Co",
      orderId: "ORD-103",
      product: "Banners",
      quantity: "10",
      priority: "High",
      status: "Quality Check", 
      submittedDate: "2025-10-31",
      dueDate: "2025-11-03",
      client: "Tech Start"
    },
    { 
      id: "JOB-304", 
      business: "FastPrint Ltd",
      orderId: "ORD-156",
      product: "Posters",
      quantity: "100",
      priority: "Low",
      status: "Completed", 
      submittedDate: "2025-10-30",
      dueDate: "2025-11-02",
      client: "Marketing Pro"
    },
    { 
      id: "JOB-305", 
      business: "QuickPrint Inc",
      orderId: "ORD-209",
      product: "Flyers",
      quantity: "2000",
      priority: "Medium",
      status: "Pending", 
      submittedDate: "2025-11-02",
      dueDate: "2025-11-06",
      client: "Sales Team Inc"
    },
  ];

  const businesses = [
    { 
      id: 1, 
      name: "PrintHub Co", 
      contact: "John Smith",
      email: "john@printhub.com", 
      phone: "(555) 111-2222",
      activeJobs: 8,
      totalJobs: 45,
      status: "Active"
    },
    { 
      id: 2, 
      name: "QuickPrint Inc", 
      contact: "Sarah Johnson",
      email: "sarah@quickprint.com", 
      phone: "(555) 333-4444",
      activeJobs: 6,
      totalJobs: 32,
      status: "Active"
    },
    { 
      id: 3, 
      name: "FastPrint Ltd", 
      contact: "Mike Wilson",
      email: "mike@fastprint.com", 
      phone: "(555) 555-6666",
      activeJobs: 4,
      totalJobs: 28,
      status: "Active"
    },
    { 
      id: 4, 
      name: "Design Print Pro", 
      contact: "Emily Davis",
      email: "emily@designprintpro.com", 
      phone: "(555) 777-8888",
      activeJobs: 5,
      totalJobs: 19,
      status: "Active"
    },
  ];

  const handleStatusUpdate = (jobId, newStatus) => {
    // TODO: Implement actual status update logic
    console.log(`Updating job ${jobId} to status: ${newStatus}`);
  };

  const handleSendMessage = () => {
    // TODO: Implement actual messaging logic
    console.log(`Sending message to ${selectedBusiness?.name}`);
    setShowMessageModal(false);
    setSelectedBusiness(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Quality Check":
        return "bg-purple-100 text-purple-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Production Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {userName}! Manage your production queue and communicate with business owners.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <span
                className={`text-sm font-medium ${
                  stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-600"> from yesterday</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button 
            onClick={() => {
              const pendingJob = jobQueue.find(job => job.status === "Pending");
              if (pendingJob) setSelectedJob(pendingJob);
            }}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Next Job
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Complete Job
          </button>
          <button 
            onClick={() => setShowMessageModal(true)}
            className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Message Business
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Production Report
          </button>
        </div>
      </div>

      {/* Job Queue */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Production Queue</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              Filter by Priority
            </button>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              Filter by Status
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobQueue.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{job.id}</p>
                      <p className="text-xs text-gray-500">{job.orderId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{job.business}</p>
                      <p className="text-xs text-gray-500">Client: {job.client}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {job.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {job.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(job.priority)}`}>
                      {job.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={job.status}
                      onChange={(e) => handleStatusUpdate(job.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 text-gray-900 ${getStatusColor(job.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Quality Check">Quality Check</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-700">{job.dueDate}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(job.dueDate) < new Date() ? (
                          <span className="text-red-600">Overdue</span>
                        ) : (
                          <span className="text-green-600">On Track</span>
                        )}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      View
                    </button>
                    <button 
                      onClick={() => {
                        const business = businesses.find(b => b.name === job.business);
                        setSelectedBusiness(business);
                        setShowMessageModal(true);
                      }}
                      className="text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Business Partners */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Business Partners</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Jobs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Jobs
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
              {businesses.map((business) => (
                <tr key={business.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {business.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{business.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {business.contact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {business.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {business.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {business.activeJobs}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {business.totalJobs}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {business.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      View Jobs
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedBusiness(business);
                        setShowMessageModal(true);
                      }}
                      className="text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Contact
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Message {selectedBusiness?.name || "Business"}
              </h3>
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setSelectedBusiness(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Message subject..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="5"
                  placeholder="Type your message here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Related Job (Optional)
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">Select a job...</option>
                  {jobQueue
                    .filter(job => job.business === selectedBusiness?.name)
                    .map(job => (
                      <option key={job.id} value={job.id}>
                        {job.id} - {job.product}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setSelectedBusiness(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
