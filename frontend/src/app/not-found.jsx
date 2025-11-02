import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        
        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>

        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="block w-full bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg text-lg font-medium shadow-lg transition-colors"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/"
            className="block w-full bg-white text-blue-600 hover:bg-gray-50 px-6 py-3 rounded-lg text-lg font-medium border-2 border-blue-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-8">
          <svg
            className="mx-auto h-64 w-64 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
