"use client";

import { useState } from "react";

export default function DesignLibrary({ onBack }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Categories
  const categories = [
    { id: 'all', name: 'All Designs', icon: '🎨' },
    { id: 'business-cards', name: 'Business Cards', icon: '📇' },
    { id: 'flyers', name: 'Flyers', icon: '📄' },
    { id: 'banners', name: 'Banners', icon: '🎯' },
    { id: 'brochures', name: 'Brochures', icon: '📰' },
    { id: 'posters', name: 'Posters', icon: '🖼️' },
    { id: 'custom', name: 'My Custom Designs', icon: '✨' },
  ];

  // Pre-defined designs
  const designs = [
    {
      id: 1,
      name: "Modern Business Card - Blue",
      category: "business-cards",
      thumbnail: "🔷",
      size: "3.5\" x 2\"",
      format: "AI, PDF",
      type: "template",
      dateAdded: "Nov 1, 2024",
      downloads: 234,
      tags: ["professional", "modern", "blue"]
    },
    {
      id: 2,
      name: "Elegant Business Card - Gold",
      category: "business-cards",
      thumbnail: "🟡",
      size: "3.5\" x 2\"",
      format: "AI, PDF",
      type: "template",
      dateAdded: "Oct 28, 2024",
      downloads: 189,
      tags: ["elegant", "luxury", "gold"]
    },
    {
      id: 3,
      name: "Event Flyer - Vibrant",
      category: "flyers",
      thumbnail: "🎉",
      size: "8.5\" x 11\"",
      format: "PSD, PDF",
      type: "template",
      dateAdded: "Oct 25, 2024",
      downloads: 567,
      tags: ["colorful", "event", "party"]
    },
    {
      id: 4,
      name: "Promotional Flyer - Sale",
      category: "flyers",
      thumbnail: "🏷️",
      size: "8.5\" x 11\"",
      format: "PSD, PDF",
      type: "template",
      dateAdded: "Oct 20, 2024",
      downloads: 423,
      tags: ["sale", "promotion", "discount"]
    },
    {
      id: 5,
      name: "Grand Opening Banner",
      category: "banners",
      thumbnail: "🎊",
      size: "6' x 3'",
      format: "AI, PDF",
      type: "template",
      dateAdded: "Oct 15, 2024",
      downloads: 156,
      tags: ["opening", "celebration", "business"]
    },
    {
      id: 6,
      name: "Product Banner - Modern",
      category: "banners",
      thumbnail: "📱",
      size: "4' x 8'",
      format: "AI, PDF",
      type: "template",
      dateAdded: "Oct 10, 2024",
      downloads: 298,
      tags: ["product", "modern", "tech"]
    },
    {
      id: 7,
      name: "Corporate Brochure - Tri-Fold",
      category: "brochures",
      thumbnail: "📘",
      size: "8.5\" x 11\"",
      format: "INDD, PDF",
      type: "template",
      dateAdded: "Oct 5, 2024",
      downloads: 345,
      tags: ["corporate", "professional", "tri-fold"]
    },
    {
      id: 8,
      name: "Travel Brochure - Bi-Fold",
      category: "brochures",
      thumbnail: "✈️",
      size: "11\" x 8.5\"",
      format: "INDD, PDF",
      type: "template",
      dateAdded: "Sep 30, 2024",
      downloads: 267,
      tags: ["travel", "tourism", "bi-fold"]
    },
    {
      id: 9,
      name: "Concert Poster - Bold",
      category: "posters",
      thumbnail: "🎸",
      size: "24\" x 36\"",
      format: "PSD, PDF",
      type: "template",
      dateAdded: "Sep 25, 2024",
      downloads: 445,
      tags: ["music", "concert", "bold"]
    },
    {
      id: 10,
      name: "Movie Poster - Cinematic",
      category: "posters",
      thumbnail: "🎬",
      size: "27\" x 40\"",
      format: "PSD, PDF",
      type: "template",
      dateAdded: "Sep 20, 2024",
      downloads: 389,
      tags: ["movie", "cinema", "dramatic"]
    },
    {
      id: 11,
      name: "My Custom Logo Design",
      category: "custom",
      thumbnail: "🎨",
      size: "Custom",
      format: "AI",
      type: "custom",
      dateAdded: "Nov 2, 2024",
      downloads: 0,
      tags: ["custom", "logo", "personal"]
    },
  ];

  // Filter designs
  const filteredDesigns = designs.filter(design => {
    const matchesCategory = selectedCategory === 'all' || design.category === selectedCategory;
    const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log("Uploading custom design:", selectedFile);
      // In production, this would upload to server
      setUploadModalOpen(false);
      setSelectedFile(null);
    }
  };

  const handleUseDesign = (design) => {
    console.log("Using design:", design);
    // In production, this would redirect to order creation with selected design
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="font-medium">Back to Dashboard</span>
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-xl shadow-sm p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Design Library</h1>
            <p className="text-purple-100">
              Browse pre-made templates or upload your custom designs
            </p>
          </div>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-white text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Custom Design
          </button>
        </div>
      </div>

      {/* Categories & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search designs by name or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Designs Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredDesigns.length} Design{filteredDesigns.length !== 1 ? 's' : ''} Found
          </h2>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDesigns.map((design) => (
              <div
                key={design.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => setSelectedDesign(design)}
              >
                {/* Thumbnail */}
                <div className="h-48 bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center text-7xl group-hover:scale-105 transition-transform">
                  {design.thumbnail}
                </div>
                
                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                      {design.name}
                    </h3>
                    {design.type === 'custom' && (
                      <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                        Custom
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <p>Size: {design.size}</p>
                    <p>Format: {design.format}</p>
                    <p className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      {design.downloads} downloads
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {design.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseDesign(design);
                    }}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    Use This Design
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            {filteredDesigns.map((design) => (
              <div
                key={design.id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer"
                onClick={() => setSelectedDesign(design)}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                  {design.thumbnail}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{design.name}</h3>
                    {design.type === 'custom' && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                        Custom
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {design.size} • {design.format} • {design.downloads} downloads
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {design.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseDesign(design);
                  }}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex-shrink-0"
                >
                  Use Design
                </button>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredDesigns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">No designs found matching your criteria</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>

      {/* Design Detail Modal */}
      {selectedDesign && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Design Details</h3>
              <button
                onClick={() => setSelectedDesign(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Preview */}
              <div className="h-64 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl flex items-center justify-center text-9xl mb-6">
                {selectedDesign.thumbnail}
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedDesign.name}</h3>
                  <div className="flex items-center gap-2">
                    {selectedDesign.type === 'custom' && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
                        Custom Design
                      </span>
                    )}
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {categories.find(c => c.id === selectedDesign.category)?.name}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Size</p>
                    <p className="font-semibold text-gray-900">{selectedDesign.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Format</p>
                    <p className="font-semibold text-gray-900">{selectedDesign.format}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Downloads</p>
                    <p className="font-semibold text-gray-900">{selectedDesign.downloads}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date Added</p>
                    <p className="font-semibold text-gray-900">{selectedDesign.dateAdded}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDesign.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleUseDesign(selectedDesign)}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Use This Design
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    Download Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Custom Design</h3>
              <button
                onClick={() => {
                  setUploadModalOpen(false);
                  setSelectedFile(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Design Name
              </label>
              <input
                type="text"
                placeholder="Enter design name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                {categories.filter(c => c.id !== 'all' && c.id !== 'custom').map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Design File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-400 transition-colors">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf,.ai,.psd,.jpg,.png,.svg"
                        onChange={handleFileSelect}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, AI, PSD, JPG, PNG, SVG up to 50MB</p>
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-2 font-medium">
                      ✓ Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setUploadModalOpen(false);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                Upload Design
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
