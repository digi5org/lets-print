"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ApiClient } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function BusinessList() {
  const { session } = useAuth();
  const router = useRouter();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [isImpersonating, setIsImpersonating] = useState(false);

  const loadBusinesses = useCallback(async () => {
    if (!session?.accessToken) {
      setLoading(false);
      return;
    }

    try {
      const api = new ApiClient(session.accessToken);
      const response = await api.get("/api/admin/tenants");
      console.log("Businesses loaded:", response);
      setBusinesses(response.data || []);
      setError(null);
    } catch (error) {
      console.error("Failed to load businesses:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to load businesses";
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  const handleLoginAs = async (business) => {
    if (!session?.accessToken || isImpersonating) return;

    try {
      setIsImpersonating(true);
      const api = new ApiClient(session.accessToken);
      const response = await api.post(`/api/admin/impersonate/${business.id}`, {
        readOnly: true
      });
      
      if (response.success) {
        toast.success(`Logging in as ${business.name} (Read-Only Mode)`);
        
        // Store the impersonation data
        sessionStorage.setItem('impersonation_token', response.data.token);
        sessionStorage.setItem('impersonation_mode', 'readonly');
        sessionStorage.setItem('impersonation_user', JSON.stringify(response.data.user));
        sessionStorage.setItem('original_admin', JSON.stringify({
          userId: session.user.id,
          email: session.user.email,
          name: session.user.name,
        }));
        
        // Use Next.js router for navigation instead of window.location
        setTimeout(() => {
          router.push('/dashboard/business');
        }, 500);
      } else {
        setIsImpersonating(false);
      }
    } catch (error) {
      console.error("Failed to impersonate:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to login as business";
      toast.error(`Error: ${errorMessage}`);
      setIsImpersonating(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  const filteredBusinesses = businesses.filter((business) =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show error state if there's an error and no businesses loaded
  if (error && businesses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Businesses</h3>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <div className="space-y-2">
            <button
              onClick={loadBusinesses}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <p className="text-xs text-gray-400 mt-4">
              Troubleshooting tips:
              <br />• Make sure the backend server is running
              <br />• Check if you have super_admin role
              <br />• Verify your authentication token is valid
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Business Cards Grid */}
      {filteredBusinesses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No businesses found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? "Try adjusting your search" : "Get started by creating a new business"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <div
              key={business.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-16 h-16 mx-auto bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2">
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {business.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono">
                      {business.slug}
                    </p>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      business.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {business.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Business Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Users</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {business._count?.users || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-purple-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Products</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {business._count?.products || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Domain Info */}
                {business.domain && (
                  <div className="mb-4 p-2 bg-blue-50 rounded-md">
                    <p className="text-xs text-gray-500">Custom Domain</p>
                    <p className="text-sm text-blue-600 font-medium truncate">
                      {business.domain}
                    </p>
                  </div>
                )}

                {/* Created Date */}
                <div className="text-xs text-gray-500 mb-4">
                  Created on {new Date(business.createdAt).toLocaleDateString()}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        window.location.href = `/dashboard/admin?tenant=${business.id}`;
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        toast.success(`Opening ${business.name}...`);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={() => handleLoginAs(business)}
                    disabled={isImpersonating}
                    className={`w-full px-4 py-2 text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center space-x-2 ${
                      isImpersonating 
                        ? 'bg-purple-400 cursor-not-allowed' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {isImpersonating ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Switching...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                          />
                        </svg>
                        <span>Login As (Read-Only)</span>
                      </>
                    )}
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
