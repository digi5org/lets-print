export default function InvoicesPaymentsSection({ invoices = [] }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Invoices and Payments</h3>
        <p className="text-sm text-gray-500">
          Review outstanding balances, download invoices, and complete payments securely.
        </p>
      </div>


      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Invoice</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Order</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Issued</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Due</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-blue-600">{invoice.id}</td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{invoice.orderId}</td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">{invoice.date}</td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">{invoice.dueDate}</td>
                <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-gray-900">{invoice.amount}</td>
                <td className="whitespace-nowrap px-4 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      invoice.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : invoice.status === "Overdue"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-right text-sm">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      className="font-medium text-blue-600 transition-colors hover:text-blue-800"
                    >
                      Download
                    </button>
                    {invoice.status !== "Paid" && (
                      <button
                        type="button"
                        className="font-medium text-green-600 transition-colors hover:text-green-700"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-500">
                  No invoices available at this time.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
