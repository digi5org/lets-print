import { useMemo, useState } from "react";

const statusClasses = {
  delivered: "bg-green-100 text-green-700",
  shipped: "bg-blue-100 text-blue-700",
  production: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  pending: "bg-purple-100 text-purple-700",
};

export default function MyOrdersSection({ orders = [], onViewOrder, onTrackOrder }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesQuery =
        query.length === 0 ||
        order.id.toLowerCase().includes(query) ||
        order.title.toLowerCase().includes(query);

        
      const matchesStatus =
        filterStatus === "all" ||
        order.status.toLowerCase() === filterStatus.toLowerCase();

      return matchesQuery && matchesStatus;
    });
  }, [orders, searchQuery, filterStatus]);

  const sortedOrders = useMemo(() => {
    const ordersCopy = [...filteredOrders];

    if (sortBy === "date") {
      ordersCopy.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "amount") {
      ordersCopy.sort(
        (a, b) =>
          parseFloat(b.total.replace(/[^0-9.]/g, "")) -
          parseFloat(a.total.replace(/[^0-9.]/g, ""))
      );
    }

    return ordersCopy;
  }, [filteredOrders, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex-1">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search orders by ID or product"
              className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="production">Production</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Order</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Product</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Quantity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Total</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {sortedOrders.map((order) => {
              const statusKey = order.status.toLowerCase();
              const badgeClass = statusClasses[statusKey] || statusClasses.pending;

              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-blue-600">{order.id}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">{order.title}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">{order.quantity}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${badgeClass}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">{order.date}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-gray-900">{order.total}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => onViewOrder?.(order)}
                        className="font-medium text-blue-600 transition-colors hover:text-blue-800"
                      >
                        View
                      </button>
                      {order.trackingNumber && (
                        <button
                          type="button"
                          onClick={() => onTrackOrder?.(order)}
                          className="font-medium text-gray-600 transition-colors hover:text-gray-800"
                        >
                          Track
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {sortedOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-500">
                  No orders match your current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
