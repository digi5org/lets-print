"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-24 w-24 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>

        {error.digest && (
          <div className="mb-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-500">
              Error ID: <span className="font-mono">{error.digest}</span>
            </p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg text-lg font-medium shadow-lg transition-colors"
          >
            Try Again
          </button>

          <Link
            href="/dashboard"
            className="block w-full bg-white text-blue-600 hover:bg-gray-50 px-6 py-3 rounded-lg text-lg font-medium border-2 border-blue-600 transition-colors"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/"
            className="block w-full text-gray-600 hover:text-gray-900 px-6 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>If this problem persists, please contact support.</p>
        </div>
      </div>
    </div>
  );
}
