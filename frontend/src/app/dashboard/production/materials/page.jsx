"use client";

import { useState } from "react";

export default function MaterialsInventoryPage() {
  const [selectedView, setSelectedView] = useState("materials");

  const materials = [
    {
      id: "MAT-001",
      name: "Glossy Paper Stock",
      category: "Paper",
      quantity: "5,000 sheets",
      unit: "sheets",
      reorderLevel: "1,000",
      status: "In Stock",
      cost: "$0.12/sheet",
      supplier: "Paper Co.",
    },
    {
      id: "MAT-002",
      name: "Matte Paper Stock",
      category: "Paper",
      quantity: "3,200 sheets",
      unit: "sheets",
      reorderLevel: "1,000",
      status: "In Stock",
      cost: "$0.10/sheet",
      supplier: "Paper Co.",
    },
    {
      id: "MAT-003",
      name: "Vinyl Material",
      category: "Specialty",
      quantity: "450 yards",
      unit: "yards",
      reorderLevel: "200",
      status: "Low Stock",
      cost: "$4.50/yard",
      supplier: "Vinyl Supply Inc.",
    },
    {
      id: "MAT-004",
      name: "Cyan Ink Cartridge",
      category: "Ink",
      quantity: "8 units",
      unit: "cartridges",
      reorderLevel: "3",
      status: "In Stock",
      cost: "$85.00/unit",
      supplier: "Ink Direct",
    },
    {
      id: "MAT-005",
      name: "Magenta Ink Cartridge",
      category: "Ink",
      quantity: "2 units",
      unit: "cartridges",
      reorderLevel: "3",
      status: "Reorder Soon",
      cost: "$85.00/unit",
      supplier: "Ink Direct",
    },
  ];

  const equipment = [
    {
      id: "EQP-001",
      name: "Digital Printer - Model X500",
      status: "Operational",
      lastMaintenance: "Oct 15, 2025",
      nextMaintenance: "Dec 15, 2025",
      utilization: "85%",
    },
    {
      id: "EQP-002",
      name: "Large Format Printer",
      status: "Operational",
      lastMaintenance: "Oct 20, 2025",
      nextMaintenance: "Dec 20, 2025",
      utilization: "72%",
    },
    {
      id: "EQP-003",
      name: "Cutting Machine",
      status: "Maintenance Required",
      lastMaintenance: "Sep 10, 2025",
      nextMaintenance: "Nov 10, 2025",
      utilization: "45%",
    },
  ];

  const stats = [
    { label: "Total Materials", value: "142", icon: "📦" },
    { label: "Low Stock Items", value: "8", icon: "⚠️", color: "orange" },
    { label: "Equipment", value: "12", icon: "🖨️" },
    { label: "Monthly Cost", value: "$8,450", icon: "💰" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-700";
      case "Low Stock":
        return "bg-orange-100 text-orange-700";
      case "Reorder Soon":
        return "bg-yellow-100 text-yellow-700";
      case "Out of Stock":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getEquipmentStatusColor = (status) => {
    switch (status) {
      case "Operational":
        return "bg-green-100 text-green-700";
      case "Maintenance Required":
        return "bg-orange-100 text-orange-700";
      case "Under Repair":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Materials & Inventory</h1>
            <p className="text-orange-100">
              Track materials, supplies, and equipment
            </p>
          </div>
          <button className="bg-white text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Material
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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

      {/* View Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedView("materials")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedView === "materials"
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Materials & Supplies
          </button>
          <button
            onClick={() => setSelectedView("equipment")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedView === "equipment"
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Equipment
          </button>
        </div>
      </div>

      {/* Materials View */}
      {selectedView === "materials" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Material Inventory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Material ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reorder Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {materials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{material.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{material.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        {material.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.reorderLevel} {material.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(material.status)}`}>
                        {material.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {material.cost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.supplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-orange-600 hover:text-orange-900 mr-3">Reorder</button>
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Equipment View */}
      {selectedView === "equipment" && (
        <div className="space-y-4">
          {equipment.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🖨️</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.id}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getEquipmentStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Last Maintenance</p>
                  <p className="text-sm font-semibold text-gray-900">{item.lastMaintenance}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Next Maintenance</p>
                  <p className="text-sm font-semibold text-gray-900">{item.nextMaintenance}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Utilization</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{ width: item.utilization }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{item.utilization}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all text-sm font-medium">
                    Schedule Maintenance
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
