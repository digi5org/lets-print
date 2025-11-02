import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Let's Print
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Cloud-based SaaS platform for print business startups. Manage your CRM, storefront, 
            client orders, and production workflows—all in one place.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Features for Every Role
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-blue-600 text-4xl mb-4">👤</div>
            <h3 className="text-xl font-bold mb-2">For Clients</h3>
            <p className="text-gray-600">
              Browse products, place orders, and track your print jobs in real-time.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-green-600 text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2">For Startup Owners</h3>
            <p className="text-gray-600">
              Manage your storefront, products, clients, and forward jobs to production partners.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-purple-600 text-4xl mb-4">🏭</div>
            <h3 className="text-xl font-bold mb-2">For Production Owners</h3>
            <p className="text-gray-600">
              Receive and manage print jobs, update order status, and deliver quality results.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-red-600 text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-bold mb-2">For Administrators</h3>
            <p className="text-gray-600">
              Complete oversight and control over the entire platform and all users.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Credentials */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Demo Credentials
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-4 rounded">
              <h4 className="font-bold mb-2">Super Admin</h4>
              <p className="text-gray-600">admin@letsprint.com</p>
              <p className="text-gray-600">admin123</p>
            </div>
            <div className="bg-white p-4 rounded">
              <h4 className="font-bold mb-2">Startup Owner</h4>
              <p className="text-gray-600">startup@letsprint.com</p>
              <p className="text-gray-600">startup123</p>
            </div>
            <div className="bg-white p-4 rounded">
              <h4 className="font-bold mb-2">Production Owner</h4>
              <p className="text-gray-600">production@letsprint.com</p>
              <p className="text-gray-600">production123</p>
            </div>
            <div className="bg-white p-4 rounded">
              <h4 className="font-bold mb-2">Client</h4>
              <p className="text-gray-600">client@example.com</p>
              <p className="text-gray-600">client123</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
