"use client";

import { useState } from "react";

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("tickets");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const tickets = [
    { id: "TKT-001", subject: "Payment issue", customer: "John Smith", priority: "high", status: "open", createdAt: "2024-12-02", category: "billing" },
    { id: "TKT-002", subject: "Unable to upload design", customer: "Jane Doe", priority: "medium", status: "in-progress", createdAt: "2024-12-01", category: "technical" },
    { id: "TKT-003", subject: "Order delivery delayed", customer: "Mike Wilson", priority: "high", status: "open", createdAt: "2024-12-01", category: "shipping" },
    { id: "TKT-004", subject: "Account login issues", customer: "Sarah Johnson", priority: "low", status: "resolved", createdAt: "2024-11-30", category: "account" },
    { id: "TKT-005", subject: "Refund request", customer: "Bob Brown", priority: "medium", status: "in-progress", createdAt: "2024-11-29", category: "billing" },
  ];

  const faqs = [
    { id: 1, question: "How do I reset my password?", answer: "Go to login page and click 'Forgot Password'...", views: 1250 },
    { id: 2, question: "What file formats are supported?", answer: "We support PNG, JPG, PDF, AI, and PSD files...", views: 980 },
    { id: 3, question: "How long does shipping take?", answer: "Standard shipping takes 5-7 business days...", views: 876 },
    { id: 4, question: "Can I cancel my order?", answer: "Orders can be cancelled within 24 hours...", views: 654 },
  ];

  const stats = {
    openTickets: tickets.filter(t => t.status === "open").length,
    inProgress: tickets.filter(t => t.status === "in-progress").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
    avgResponseTime: "2.5 hours",
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open": return "bg-blue-100 text-blue-800";
      case "in-progress": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Support</h1>
        <p className="text-gray-600 mt-1">Manage support tickets and customer inquiries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Open Tickets</p>
          <p className="text-2xl font-bold text-blue-600">{stats.openTickets}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Resolved</p>
          <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Avg Response Time</p>
          <p className="text-2xl font-bold text-purple-600">{stats.avgResponseTime}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {["tickets", "faqs", "knowledge-base"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </nav>
      </div>

      {/* Tickets Tab */}
      {activeTab === "tickets" && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>All Status</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>All Priority</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Create Ticket
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{ticket.id}</p>
                    <p className="text-sm text-gray-600">{ticket.subject}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{ticket.customer}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 capitalize">{ticket.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{ticket.createdAt}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">View</button>
                    <button className="text-green-600 hover:text-green-800">Reply</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FAQs Tab */}
      {activeTab === "faqs" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add FAQ
            </button>
          </div>
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{faq.question}</h3>
                  <p className="text-gray-600 mt-2">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{faq.views} views</span>
                  <button className="text-blue-600 hover:text-blue-800">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Knowledge Base Tab */}
      {activeTab === "knowledge-base" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">Knowledge Base</h3>
            <p className="text-gray-600 mt-2">Create and manage knowledge base articles for customers</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Create Article
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
