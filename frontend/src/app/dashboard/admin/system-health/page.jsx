"use client";

import { useState, useEffect } from "react";

export default function SystemHealthPage() {
  const [metrics, setMetrics] = useState({
    serverUptime: "99.8%",
    apiResponseTime: "124ms",
    storageUsed: "342 GB",
    storageTotal: "1 TB",
    activeSessions: 156,
    cpuUsage: 45,
    memoryUsage: 62,
    databaseConnections: 28,
  });

  const [services, setServices] = useState([
    { name: "API Server", status: "operational", uptime: "99.9%", lastCheck: "2 min ago" },
    { name: "Database", status: "operational", uptime: "99.8%", lastCheck: "1 min ago" },
    { name: "File Storage", status: "operational", uptime: "100%", lastCheck: "3 min ago" },
    { name: "Email Service", status: "operational", uptime: "99.5%", lastCheck: "5 min ago" },
    { name: "Payment Gateway", status: "operational", uptime: "99.9%", lastCheck: "1 min ago" },
    { name: "CDN", status: "degraded", uptime: "98.2%", lastCheck: "30 sec ago" },
  ]);

  const [recentIncidents, setRecentIncidents] = useState([
    { id: 1, title: "CDN Latency Spike", status: "investigating", time: "10 min ago", severity: "warning" },
    { id: 2, title: "Scheduled Maintenance", status: "completed", time: "2 days ago", severity: "info" },
    { id: 3, title: "Database Failover Test", status: "completed", time: "5 days ago", severity: "info" },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "operational": return "bg-green-500";
      case "degraded": return "bg-yellow-500";
      case "outage": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "info": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
        <p className="text-gray-600 mt-1">Monitor system performance and service status</p>
      </div>

      {/* Overall Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
        <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-green-800 font-medium">All systems operational</span>
        <span className="text-green-600 text-sm ml-auto">Last updated: Just now</span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-1">Server Uptime</p>
          <p className="text-3xl font-bold text-gray-900">{metrics.serverUptime}</p>
          <p className="text-xs text-green-600 mt-2">Excellent</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-1">API Response Time</p>
          <p className="text-3xl font-bold text-gray-900">{metrics.apiResponseTime}</p>
          <p className="text-xs text-green-600 mt-2">Good</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-1">Storage Used</p>
          <p className="text-3xl font-bold text-gray-900">{metrics.storageUsed}</p>
          <p className="text-xs text-gray-500 mt-2">of {metrics.storageTotal}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-1">Active Sessions</p>
          <p className="text-3xl font-bold text-gray-900">{metrics.activeSessions}</p>
          <p className="text-xs text-blue-600 mt-2">+12 from last hour</p>
        </div>
      </div>

      {/* Resource Usage */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resource Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">CPU Usage</span>
              <span className="text-sm font-medium">{metrics.cpuUsage}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${metrics.cpuUsage}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Memory Usage</span>
              <span className="text-sm font-medium">{metrics.memoryUsage}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${metrics.memoryUsage}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Database Connections</span>
              <span className="text-sm font-medium">{metrics.databaseConnections}/50</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${(metrics.databaseConnections / 50) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Services Status</h2>
        <div className="space-y-3">
          {services.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`}></div>
                <span className="font-medium text-gray-900">{service.name}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm text-gray-600">Uptime: {service.uptime}</span>
                <span className="text-sm text-gray-500">Checked: {service.lastCheck}</span>
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                  service.status === "operational" ? "bg-green-100 text-green-800" : 
                  service.status === "degraded" ? "bg-yellow-100 text-yellow-800" : 
                  "bg-red-100 text-red-800"
                }`}>
                  {service.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Incidents</h2>
        <div className="space-y-3">
          {recentIncidents.map((incident) => (
            <div key={incident.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(incident.severity)}`}>
                  {incident.severity}
                </span>
                <span className="font-medium text-gray-900">{incident.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{incident.time}</span>
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                  incident.status === "completed" ? "bg-green-100 text-green-800" :
                  incident.status === "investigating" ? "bg-yellow-100 text-yellow-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {incident.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
