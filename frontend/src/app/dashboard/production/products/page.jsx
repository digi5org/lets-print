"use client";

import { useState } from "react";

export default function ProductsServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const products = [
    {
      id: "PRD-001",
      name: "Business Cards",
      category: "Cards",
      price: "$0.45/unit",
      stock: "In Stock",
      orders: 156,
      image: "💳",
    },
    {
      id: "PRD-002",
      name: "Brochures",
      category: "Marketing",
      price: "$1.70/unit",
      stock: "In Stock",
      orders: 89,
      image: "📄",
    },
    {
      id: "PRD-003",
      name: "Banners",
      category: "Large Format",
      price: "$120.00/unit",
      stock: "Low Stock",
      orders: 34,
      image: "🎯",
    },
    {
      id: "PRD-004",
      name: "Flyers",
      category: "Marketing",
      price: "$0.16/unit",
      stock: "In Stock",
      orders: 234,
      image: "📋",
    },
    {
      id: "PRD-005",
      name: "Posters",
      category: "Large Format",
      price: "$6.80/unit",
      stock: "In Stock",
      orders: 67,
      image: "🖼️",
    },
    {
      id: "PRD-006",
      name: "Stickers",
      category: "Specialty",
      price: "$0.25/unit",
      stock: "In Stock",
      orders: 189,
      image: "🏷️",
    },
  ];

  const stats = [
    { label: "Total Products", value: "48", icon: "📦" },
    { label: "Active Services", value: "12", icon: "⚙️" },
    { label: "Total Orders", value: "769", icon: "📊" },
    { label: "Revenue", value: "$45.2K", icon: "💰" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Products & Services</h1>
            <p className="text-blue-100">
              Manage your product catalog and services
            </p>
          </div>
          <button className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
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

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2">
          {["all", "Cards", "Marketing", "Large Format", "Specialty"].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category === "all" ? "All Products" : category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 h-40 flex items-center justify-center">
              <span className="text-6xl">{product.image}</span>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.id}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  product.stock === "In Stock" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-orange-100 text-orange-700"
                }`}>
                  {product.stock}
                </span>
              </div>
              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                  {product.category}
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-lg font-bold text-gray-900">{product.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Orders</p>
                  <p className="text-lg font-bold text-gray-900">{product.orders}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium">
                  Edit
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Services Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Express Printing", icon: "⚡", description: "24-hour turnaround" },
            { name: "Design Consultation", icon: "🎨", description: "Professional design help" },
            { name: "Bulk Discounts", icon: "💰", description: "Save on large orders" },
            { name: "Custom Finishing", icon: "✨", description: "Special finishing options" },
            { name: "Direct Mail", icon: "📮", description: "Full mailing service" },
            { name: "Storage Service", icon: "📦", description: "Inventory management" },
          ].map((service) => (
            <div key={service.name} className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{service.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
