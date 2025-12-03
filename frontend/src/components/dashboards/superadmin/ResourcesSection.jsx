"use client";

import { useState } from "react";

export default function ResourcesSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Resources" },
    { id: "documentation", name: "Documentation" },
    { id: "templates", name: "Templates" },
    { id: "guides", name: "Guides" },
    { id: "videos", name: "Videos" },
  ];

  const resources = [
    { id: 1, title: "Getting Started Guide", category: "guides", type: "PDF", size: "2.5 MB", downloads: 1250, updatedAt: "2024-12-01" },
    { id: 2, title: "API Documentation", category: "documentation", type: "Web", size: "-", downloads: 3420, updatedAt: "2024-11-28" },
    { id: 3, title: "Invoice Template", category: "templates", type: "DOCX", size: "156 KB", downloads: 890, updatedAt: "2024-11-25" },
    { id: 4, title: "Product Setup Tutorial", category: "videos", type: "Video", size: "45 MB", downloads: 567, updatedAt: "2024-11-20" },
    { id: 5, title: "Design Specifications", category: "documentation", type: "PDF", size: "1.8 MB", downloads: 432, updatedAt: "2024-11-15" },
    { id: 6, title: "Order Form Template", category: "templates", type: "PDF", size: "89 KB", downloads: 765, updatedAt: "2024-11-10" },
  ];

  const stats = {
    totalResources: resources.length,
    totalDownloads: resources.reduce((acc, r) => acc + r.downloads, 0),
    storageUsed: "125 MB",
  };

  const filteredResources =
    activeCategory === "all"
      ? resources
      : resources.filter((resource) => resource.category === activeCategory);

  const getTypeIcon = (type) => {
    switch (type) {
      case "PDF":
        return (
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
            <path d="M14 2v6h6M9.5 12.5l1.5 1.5-1.5 1.5M14.5 12.5L13 14l1.5 1.5" />
          </svg>
        );
      case "Video":
        return (
          <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case "Web":
        return (
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
          <p className="text-gray-600 mt-1">Manage documentation, templates, and guides</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload Resource
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total Resources</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalResources}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Total Downloads</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalDownloads.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Storage Used</p>
          <p className="text-2xl font-bold text-gray-900">{stats.storageUsed}</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              activeCategory === cat.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              {getTypeIcon(resource.type)}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{resource.title}</h3>
                <p className="text-sm text-gray-500 capitalize">{resource.category}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>
                {resource.type} • {resource.size}
              </span>
              <span>{resource.downloads} downloads</span>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Download
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                Edit
              </button>
              <button className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
