"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function TicketsPage() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add or edit
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "Quality",
    customerName: "",
    assignedTo: "",
  });
  const [commentText, setCommentText] = useState("");

  // Fetch tickets
  const fetchTickets = useCallback(async () => {
    if (!token) return;
    
    // Store token temporarily for API calls
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
    
    try {
      const data = await api.get("/api/tickets");
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to load tickets");
    }
  }, [token]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    if (!token) return;
    
    // Store token temporarily for API calls
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
    
    try {
      const data = await api.get("/api/tickets/stats");
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [token]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTickets(), fetchStats()]);
      setLoading(false);
    };
    
    loadData();
  }, [fetchTickets, fetchStats]);

  // Create ticket
  const handleCreateTicket = () => {
    setModalMode("add");
    setFormData({
      title: "",
      description: "",
      priority: "Medium",
      category: "Quality",
      customerName: "",
      assignedTo: "",
    });
    setShowModal(true);
  };

  // Edit ticket
  const handleEditTicket = (ticket) => {
    setModalMode("edit");
    setSelectedTicket(ticket);
    setFormData({
      title: ticket.title,
      description: ticket.description || "",
      priority: ticket.priority,
      category: ticket.category,
      customerName: ticket.customerName || "",
      assignedTo: ticket.assignedTo || "",
    });
    setShowModal(true);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) return;

    // Store token temporarily for API calls
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }

    try {
      // Clean up formData - convert empty strings to null for optional fields
      const cleanedData = {
        ...formData,
        assignedTo: formData.assignedTo || null,
        customerName: formData.customerName || null,
      };

      if (modalMode === "add") {
        await api.post("/api/tickets", cleanedData);
        toast.success("Ticket created successfully");
      } else {
        await api.put(`/api/tickets/${selectedTicket.id}`, cleanedData);
        toast.success("Ticket updated successfully");
      }
      
      setShowModal(false);
      fetchTickets();
      fetchStats();
    } catch (error) {
      console.error("Error saving ticket:", error);
      toast.error(`Failed to ${modalMode === "add" ? "create" : "update"} ticket`);
    }
  };

  // Update status
  const handleUpdateStatus = async (ticketId, newStatus) => {
    if (!token) return;

    // Store token temporarily for API calls
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }

    try {
      await api.patch(`/api/tickets/${ticketId}/status`, { status: newStatus });
      toast.success("Status updated successfully");
      fetchTickets();
      fetchStats();
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Delete ticket
  const handleDeleteTicket = async (ticketId) => {
    if (!token || !confirm("Are you sure you want to delete this ticket?")) return;

    // Store token temporarily for API calls
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }

    try {
      await api.delete(`/api/tickets/${ticketId}`);
      toast.success("Ticket deleted successfully");
      fetchTickets();
      fetchStats();
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(null);
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast.error("Failed to delete ticket");
    }
  };

  // Add comment
  const handleAddComment = async (ticketId) => {
    if (!token || !commentText.trim()) return;

    // Store token temporarily for API calls
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }

    try {
      await api.post(`/api/tickets/${ticketId}/comments`, {
        comment: commentText,
        isInternal: false,
      });
      toast.success("Comment added successfully");
      setCommentText("");
      
      // Refresh ticket details
      const updatedTicket = await api.get(`/api/tickets/${ticketId}`);
      setSelectedTicket(updatedTicket);
      fetchTickets();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    if (selectedStatus === "all") return true;
    if (selectedStatus === "open") return ticket.status === "Open";
    if (selectedStatus === "in-progress") return ticket.status === "In Progress";
    if (selectedStatus === "resolved") return ticket.status === "Resolved";
    return true;
  });

  // Stats data
  const statsData = stats ? [
    { label: "Open Tickets", value: stats.openTickets || 0, icon: "📝", color: "blue" },
    { label: "In Progress", value: stats.inProgressTickets || 0, icon: "⚙️", color: "yellow" },
    { label: "Resolved Today", value: stats.resolvedToday || 0, icon: "✅", color: "green" },
    { label: "Avg. Response Time", value: stats.avgResponseTime || "N/A", icon: "⏱️", color: "purple" },
  ] : [
    { label: "Open Tickets", value: "...", icon: "📝", color: "blue" },
    { label: "In Progress", value: "...", icon: "⚙️", color: "yellow" },
    { label: "Resolved Today", value: "...", icon: "✅", color: "green" },
    { label: "Avg. Response Time", value: "...", icon: "⏱️", color: "purple" },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-orange-100 text-orange-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "Closed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tickets</h1>
            <p className="text-red-100">
              Support tickets and issue tracking
            </p>
          </div>
          <button 
            onClick={handleCreateTicket}
            className="bg-white text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Ticket
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStatus("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedStatus === "all"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Tickets
          </button>
          <button
            onClick={() => setSelectedStatus("open")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedStatus === "open"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setSelectedStatus("in-progress")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedStatus === "in-progress"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setSelectedStatus("resolved")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedStatus === "resolved"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tickets Found</h3>
            <p className="text-gray-600 mb-4">
              {selectedStatus === "all" && "No tickets have been created yet"}
              {selectedStatus === "open" && "No open tickets"}
              {selectedStatus === "in-progress" && "No tickets in progress"}
              {selectedStatus === "resolved" && "No resolved tickets"}
            </p>
            <button 
              onClick={handleCreateTicket}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
            >
              Create First Ticket
            </button>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {ticket.customerName || "N/A"}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {ticket.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-gray-400">#{ticket.ticketNumber}</span>
                  </div>
                </div>
                <div className="text-2xl ml-4">🎫</div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setSelectedTicket(ticket);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium"
                >
                  View Details
                </button>
                {ticket.status !== "Resolved" && ticket.status !== "Closed" && (
                  <>
                    <button 
                      onClick={() => handleEditTicket(ticket)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                    >
                      Edit
                    </button>
                    {ticket.status === "Open" && (
                      <button 
                        onClick={() => handleUpdateStatus(ticket.id, "In Progress")}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                      >
                        Start Working
                      </button>
                    )}
                    {ticket.status === "In Progress" && (
                      <button 
                        onClick={() => handleUpdateStatus(ticket.id, "Resolved")}
                        className="px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-all text-sm font-medium"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && !showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Ticket Details</h2>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 transition hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedTicket.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">Ticket ID: {selectedTicket.ticketNumber}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedTicket.customerName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedTicket.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="text-sm font-semibold text-gray-900">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-sm font-semibold text-gray-900">{new Date(selectedTicket.updatedAt).toLocaleString()}</p>
                </div>
                {selectedTicket.assignedUser && (
                  <div>
                    <p className="text-sm text-gray-500">Assigned To</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedTicket.assignedUser.name || selectedTicket.assignedUser.email}</p>
                  </div>
                )}
                {selectedTicket.creator && (
                  <div>
                    <p className="text-sm text-gray-500">Created By</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedTicket.creator.name || selectedTicket.creator.email}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4">
                  {selectedTicket.description || "No description provided"}
                </p>
              </div>

              {/* Comments Section */}
              {selectedTicket.comments && selectedTicket.comments.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Comments ({selectedTicket.comments.length})</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedTicket.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900">{comment.user?.name || comment.user?.email}</p>
                          <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                        </div>
                        <p className="text-sm text-gray-700">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Comment */}
              {selectedTicket.status !== "Closed" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Add Comment</label>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows="3"
                    placeholder="Write a comment..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  ></textarea>
                  <button
                    type="button"
                    onClick={() => handleAddComment(selectedTicket.id)}
                    disabled={!commentText.trim()}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Comment
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                {selectedTicket.status === "Open" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedTicket.id, "In Progress")}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Start Working
                  </button>
                )}
                {selectedTicket.status === "In Progress" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedTicket.id, "Resolved")}
                    className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    Mark as Resolved
                  </button>
                )}
                {selectedTicket.status === "Resolved" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedTicket.id, "Closed")}
                    className="flex-1 rounded-lg bg-gray-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700"
                  >
                    Close Ticket
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleEditTicket(selectedTicket)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-red-500 hover:text-red-600"
                >
                  Edit Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalMode === "add" ? "Create New Ticket" : "Edit Ticket"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="Quality">Quality</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Billing">Billing</option>
                    <option value="Design">Design</option>
                    <option value="Technical">Technical</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
                >
                  {modalMode === "add" ? "Create Ticket" : "Update Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
