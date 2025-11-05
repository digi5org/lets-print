import { useMemo } from "react";

const timelineStages = [
  { key: "placed", label: "Order Placed", description: "We received your order." },
  { key: "approved", label: "Design Approved", description: "Design proof confirmed." },
  { key: "production", label: "In Production", description: "Printing and finishing in progress." },
  { key: "shipped", label: "Shipped", description: "Order handed off to the carrier." },
  { key: "delivered", label: "Delivered", description: "Package delivered." },
];

function getCurrentStage(status) {
  switch (status.toLowerCase()) {
    case "delivered":
      return "delivered";
    case "shipped":
      return "shipped";
    case "production":
      return "production";
    case "approved":
      return "approved";
    default:
      return "placed";
  }
}


export default function TrackShipmentSection({ orders = [], selectedOrder, onSelectOrder }) {
  const activeStage = useMemo(() => {
    if (!selectedOrder) {
      return "placed";
    }
    return getCurrentStage(selectedOrder.status || "placed");
  }, [selectedOrder]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label htmlFor="shipment-order" className="mb-2 block text-sm font-medium text-gray-700">
            Select an order to track
          </label>
          <select
            id="shipment-order"
            value={selectedOrder?.id || ""}
            onChange={(event) => {
              const order = orders.find((item) => item.id === event.target.value);
              onSelectOrder?.(order || null);
            }}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Choose an order
            </option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.id} - {order.title}
              </option>
            ))}
          </select>
        </div>
        {selectedOrder?.trackingNumber && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Tracking number: <span className="font-semibold">{selectedOrder.trackingNumber}</span>
          </div>
        )}
      </div>

      {!selectedOrder && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-sm text-gray-500">
          Pick an order above to view its delivery progress.
        </div>
      )}

      {selectedOrder && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Order</p>
                <p className="text-lg font-semibold text-gray-900">{selectedOrder.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Product</p>
                <p className="text-lg font-semibold text-gray-900">{selectedOrder.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Placed on</p>
                <p className="text-sm font-medium text-gray-900">{selectedOrder.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated delivery</p>
                <p className="text-sm font-medium text-gray-900">{selectedOrder.deliveryDate || "TBD"}</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-xl border border-gray-200 bg-white p-6">
            <div className="absolute left-10 top-12 bottom-12 w-px bg-gray-200" aria-hidden="true"></div>
            <div className="space-y-8">
              {timelineStages.map((stage, index) => {
                const isActive = timelineStages.findIndex((item) => item.key === activeStage) >= index;
                const isCurrent = timelineStages.findIndex((item) => item.key === activeStage) === index;

                return (
                  <div key={stage.key} className="relative flex gap-6">
                    <div className="relative z-10 mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-white shadow">
                      <span
                        className={`h-5 w-5 rounded-full ${
                          isActive ? (isCurrent ? "bg-blue-500" : "bg-green-500") : "bg-gray-300"
                        }`}
                      ></span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{stage.label}</p>
                      <p className="text-sm text-gray-500">{stage.description}</p>
                      {isCurrent && (
                        <p className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                          Current status: {selectedOrder.status}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-base font-semibold text-gray-900">Carrier updates</h3>
            {selectedOrder.trackingNumber ? (
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li>Package registered with carrier.</li>
                <li>Carrier preparing shipment details.</li>
                <li>Tracking information may take a few hours to update.</li>
              </ul>
            ) : (
              <p className="mt-4 text-sm text-gray-500">
                Tracking number will appear as soon as the order leaves production.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
