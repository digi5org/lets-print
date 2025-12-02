"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ApiClient } from "@/lib/apiClient";
import toast from "react-hot-toast";

export default function MaterialsInventoryPage() {
  const { token } = useAuth();
  const [selectedView, setSelectedView] = useState("materials");
  const [materials, setMaterials] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [stats, setStats] = useState({
    totalMaterials: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalCost: 0,
  });
  const [equipmentStats, setEquipmentStats] = useState({
    totalEquipment: 0,
    operational: 0,
    maintenanceRequired: 0,
    underRepair: 0,
    totalCost: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    reorderLevel: "",
    costPerUnit: "",
    supplier: "",
    description: "",
  });
  const [equipmentFormData, setEquipmentFormData] = useState({
    name: "",
    equipmentType: "",
    model: "",
    serialNumber: "",
    status: "Operational",
    lastMaintenance: "",
    nextMaintenance: "",
    purchaseDate: "",
    supplier: "",
    cost: "",
    location: "",
  });

  const fetchMaterials = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const apiClient = new ApiClient(token);
      
      if (selectedView === "materials") {
        const [materialsRes, statsRes] = await Promise.all([
          apiClient.get("/api/materials"),
          apiClient.get("/api/materials/stats"),
        ]);

        if (materialsRes.success) {
          setMaterials(materialsRes.data);
        }

        if (statsRes.success) {
          setStats(statsRes.data);
        }
      } else {
        const [equipmentRes, statsRes] = await Promise.all([
          apiClient.get("/api/equipment"),
          apiClient.get("/api/equipment/stats"),
        ]);

        if (equipmentRes.success) {
          setEquipment(equipmentRes.data);
        }

        if (statsRes.success) {
          setEquipmentStats(statsRes.data);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [token, selectedView]);

  useEffect(() => {
    if (token) {
      fetchMaterials();
    }
  }, [token, fetchMaterials, selectedView]);

  const handleAddMaterial = () => {
    setModalMode("add");
    setFormData({
      name: "",
      category: "",
      quantity: "",
      unit: "",
      reorderLevel: "",
      costPerUnit: "",
      supplier: "",
      description: "",
    });
    setShowModal(true);
  };

  const handleEditMaterial = (material) => {
    setModalMode("edit");
    setSelectedMaterial(material);
    setFormData({
      name: material.name,
      category: material.category,
      quantity: material.quantity.toString(),
      unit: material.unit,
      reorderLevel: material.reorderLevel.toString(),
      costPerUnit: material.costPerUnit.toString(),
      supplier: material.supplier || "",
      description: material.description || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
      const apiClient = new ApiClient(token);
      
      if (modalMode === "add") {
        const response = await apiClient.post("/api/materials", formData);
        if (response.success) {
          toast.success("Material added successfully");
          fetchMaterials();
          setShowModal(false);
        }
      } else {
        const response = await apiClient.put(`/api/materials/${selectedMaterial.id}`, formData);
        if (response.success) {
          toast.success("Material updated successfully");
          fetchMaterials();
          setShowModal(false);
        }
      }
    } catch (error) {
      console.error("Error saving material:", error);
      toast.error(error.message || "Failed to save material");
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!confirm("Are you sure you want to delete this material?")) return;
    if (!token) return;

    try {
      const apiClient = new ApiClient(token);
      const response = await apiClient.delete(`/api/materials/${materialId}`);
      
      if (response.success) {
        toast.success("Material deleted successfully");
        fetchMaterials();
      }
    } catch (error) {
      console.error("Error deleting material:", error);
      toast.error("Failed to delete material");
    }
  };

  // Equipment handlers
  const handleAddEquipment = () => {
    setModalMode("add");
    setEquipmentFormData({
      name: "",
      equipmentType: "",
      model: "",
      serialNumber: "",
      status: "Operational",
      lastMaintenance: "",
      nextMaintenance: "",
      purchaseDate: "",
      supplier: "",
      cost: "",
      location: "",
    });
    setShowEquipmentModal(true);
  };

  const handleEditEquipment = (equip) => {
    setModalMode("edit");
    setSelectedEquipment(equip);
    setEquipmentFormData({
      name: equip.name,
      equipmentType: equip.equipmentType,
      model: equip.model || "",
      serialNumber: equip.serialNumber || "",
      status: equip.status,
      lastMaintenance: equip.lastMaintenance ? new Date(equip.lastMaintenance).toISOString().split('T')[0] : "",
      nextMaintenance: equip.nextMaintenance ? new Date(equip.nextMaintenance).toISOString().split('T')[0] : "",
      purchaseDate: equip.purchaseDate ? new Date(equip.purchaseDate).toISOString().split('T')[0] : "",
      supplier: equip.supplier || "",
      cost: equip.cost?.toString() || "",
      location: equip.location || "",
    });
    setShowEquipmentModal(true);
  };

  const handleEquipmentSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
      const apiClient = new ApiClient(token);
      
      if (modalMode === "add") {
        const response = await apiClient.post("/api/equipment", equipmentFormData);
        if (response.success) {
          toast.success("Equipment added successfully");
          fetchMaterials();
          setShowEquipmentModal(false);
        }
      } else {
        const response = await apiClient.put(`/api/equipment/${selectedEquipment.id}`, equipmentFormData);
        if (response.success) {
          toast.success("Equipment updated successfully");
          fetchMaterials();
          setShowEquipmentModal(false);
        }
      }
    } catch (error) {
      console.error("Error saving equipment:", error);
      toast.error(error.message || "Failed to save equipment");
    }
  };

  const handleDeleteEquipment = async (equipmentId) => {
    if (!confirm("Are you sure you want to delete this equipment?")) return;
    if (!token) return;

    try {
      const apiClient = new ApiClient(token);
      const response = await apiClient.delete(`/api/equipment/${equipmentId}`);
      
      if (response.success) {
        toast.success("Equipment deleted successfully");
        fetchMaterials();
      }
    } catch (error) {
      console.error("Error deleting equipment:", error);
      toast.error("Failed to delete equipment");
    }
  };

  const statsData = selectedView === "materials" ? [
    { label: "Total Materials", value: stats.totalMaterials?.toString() || "0", icon: "📦" },
    { label: "Low Stock Items", value: stats.lowStockCount?.toString() || "0", icon: "⚠️", color: "orange" },
    { label: "Out of Stock", value: stats.outOfStockCount?.toString() || "0", icon: "🚫", color: "red" },
    { label: "Inventory Value", value: `৳${stats.totalCost?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`, icon: "💰" },
  ] : [
    { label: "Total Equipment", value: equipmentStats.totalEquipment?.toString() || "0", icon: "🖨️" },
    { label: "Operational", value: equipmentStats.operational?.toString() || "0", icon: "✅", color: "green" },
    { label: "Maintenance Required", value: equipmentStats.maintenanceRequired?.toString() || "0", icon: "⚠️", color: "orange" },
    { label: "Equipment Value", value: `৳${equipmentStats.totalCost?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`, icon: "💰" },
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

  if (loading && ((selectedView === "materials" && materials.length === 0) || (selectedView === "equipment" && equipment.length === 0))) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

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
          <button 
            onClick={selectedView === "materials" ? handleAddMaterial : handleAddEquipment}
            className="bg-white text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {selectedView === "materials" ? "Add Material" : "Add Equipment"}
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
                      {material.quantity} {material.unit}
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
                      ৳{material.costPerUnit?.toFixed(2)}/{material.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.supplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleEditMaterial(material)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteMaterial(material.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
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
          {equipment.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="text-6xl mb-4">🖨️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Equipment Found</h3>
              <p className="text-gray-600 mb-4">Start by adding your first equipment</p>
              <button 
                onClick={handleAddEquipment}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium"
              >
                Add Equipment
              </button>
            </div>
          ) : (
            equipment.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">🖨️</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.equipmentType} {item.model ? `- ${item.model}` : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getEquipmentStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <button 
                      onClick={() => handleEditEquipment(item)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteEquipment(item.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Last Maintenance</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {item.lastMaintenance ? new Date(item.lastMaintenance).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Next Maintenance</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {item.nextMaintenance ? new Date(item.nextMaintenance).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Utilization</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-600 h-2 rounded-full"
                          style={{ width: `${item.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{item.utilization}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="text-sm font-semibold text-gray-900">{item.location || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Material Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {modalMode === "add" ? "Add New Material" : "Edit Material"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Material Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Glossy Paper Stock"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Paper">Paper</option>
                    <option value="Ink">Ink</option>
                    <option value="Vinyl">Vinyl</option>
                    <option value="Specialty">Specialty</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Unit *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., sheets, yards, cartridges"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reorder Level *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cost Per Unit *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.costPerUnit}
                    onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Supplier
                </label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Supplier name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Material description..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all"
                >
                  {modalMode === "add" ? "Add Material" : "Update Material"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Equipment Modal */}
      {showEquipmentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {modalMode === "add" ? "Add New Equipment" : "Edit Equipment"}
                </h2>
                <button
                  onClick={() => setShowEquipmentModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleEquipmentSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Equipment Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={equipmentFormData.name}
                    onChange={(e) => setEquipmentFormData({ ...equipmentFormData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., UV Printer 3000X"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Equipment Type *
                  </label>
                  <select
                    required
                    value={equipmentFormData.equipmentType}
                    onChange={(e) => setEquipmentFormData({ ...equipmentFormData, equipmentType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Type</option>
                    <option value="Printer">Printer</option>
                    <option value="Cutter">Cutter</option>
                    <option value="Laminator">Laminator</option>
                    <option value="Press">Press</option>
                    <option value="Bindery">Bindery</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    value={equipmentFormData.model}
                    onChange={(e) => setEquipmentFormData({ ...equipmentFormData, model: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Model number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    value={equipmentFormData.serialNumber}
                    onChange={(e) => setEquipmentFormData({ ...equipmentFormData, serialNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Serial number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={equipmentFormData.status}
                    onChange={(e) => setEquipmentFormData({ ...equipmentFormData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Operational">Operational</option>
                    <option value="Maintenance Required">Maintenance Required</option>
                    <option value="Under Repair">Under Repair</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={equipmentFormData.location}
                    onChange={(e) => setEquipmentFormData({ ...equipmentFormData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Production Floor A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Maintenance
                  </label>
                  <input
                    type="date"
                    value={equipmentFormData.lastMaintenance}
                    onChange={(e) => setEquipmentFormData({ ...equipmentFormData, lastMaintenance: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Next Maintenance
                  </label>
                  <input
                    type="date"
                    value={equipmentFormData.nextMaintenance}
                    onChange={(e) => setEquipmentFormData({ ...equipmentFormData, nextMaintenance: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={equipmentFormData.purchaseDate}
                    onChange={(e) => setEquipmentFormData({ ...equipmentFormData, purchaseDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cost (৳)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={equipmentFormData.cost}
                    onChange={(e) => setEquipmentFormData({ ...equipmentFormData, cost: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0.00"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Supplier
                  </label>
                  <input
                    type="text"
                    value={equipmentFormData.supplier}
                    onChange={(e) => setEquipmentFormData({ ...equipmentFormData, supplier: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Supplier name"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEquipmentModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-all"
                >
                  {modalMode === "add" ? "Add Equipment" : "Update Equipment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
