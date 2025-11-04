export default function BrowseProductsSection({ products = [], onOrderProduct }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">Browse Products</h3>
          <p className="text-sm text-gray-500">
            Explore popular print products and reorder with saved specifications.
          </p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search products"
            className="w-52 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All categories</option>
            <option value="stationery">Stationery</option>
            <option value="marketing">Marketing</option>
            <option value="large-format">Large Format</option>
            <option value="promotional">Promotional</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="h-44 bg-gradient-to-br from-blue-50 to-gray-100" aria-hidden="true" />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between">
                <h4 className="text-base font-semibold text-gray-900">{product.name}</h4>
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                  {product.category}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-600">{product.description}</p>
              <p className="mt-4 text-sm font-semibold text-gray-900">{product.price}</p>
              <div className="mt-auto flex gap-3 pt-5">
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
                >
                  View Details
                </button>
                <button
                  type="button"
                  onClick={() => onOrderProduct?.(product)}
                  className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center text-sm text-gray-500">
            No products available. Check back later or contact support for custom quotes.
          </div>
        )}
      </div>
    </div>
  );
}
