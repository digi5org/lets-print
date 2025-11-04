"use client";

import { useState } from "react";
import MyOrdersSection from "@/components/dashboards/client/MyOrdersSection";

const orders = [
  {
    id: "ORD-1023",
    title: "Business Cards",
    status: "Production",
    date: "2024-12-10",
    quantity: "500 cards",
    total: "$450.00",
    customer: "Tech Solutions Inc.",
    deliveryDate: "2024-12-15",
    notes: "Premium finish with gold foil",
  },
  {
    id: "ORD-1018",
    title: "Flyers - 500pc",
    status: "Shipped",
    date: "2024-12-08",
    quantity: "500 units",
    total: "$320.00",
    customer: "Marketing Agency",
    deliveryDate: "2024-12-12",
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD-1015",
    title: "Banners",
    status: "Delivered",
    date: "2024-12-05",
    quantity: "3 banners",
    total: "$180.00",
    customer: "Event Planners Co.",
    deliveryDate: "2024-12-08",
  },
  {
    id: "ORD-1012",
    title: "Brochures",
    status: "Delivered",
    date: "2024-12-01",
    quantity: "200 units",
    total: "$290.00",
    customer: "Real Estate Group",
    deliveryDate: "2024-12-05",
  },
  {
    id: "ORD-1008",
    title: "Posters A2",
    status: "Cancelled",
    date: "2024-11-28",
    quantity: "50 posters",
    total: "$220.00",
    customer: "Music Festival",
    deliveryDate: "N/A",
  },
];

export default function MyOrdersPage() {
  const [orderDetailModal, setOrderDetailModal] = useState(null);

  const handleViewOrder = (order) => {
    setOrderDetailModal(order);
  };

  const handleTrackOrder = (order) => {
    // Redirect to tracking page or show tracking modal
    console.log("Track order:", order);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-1 text-sm text-gray-500">View and manage all your print orders</p>
        </div>
      </div>

      <MyOrdersSection
        orders={orders}
        onViewOrder={handleViewOrder}
        onTrackOrder={handleTrackOrder}
      />

      {/* Order Detail Modal */}
      {orderDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
              <button
                type="button"
                onClick={() => setOrderDetailModal(null)}
                className="text-gray-400 transition hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-sm font-semibold text-gray-900">{orderDetailModal.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-sm font-semibold text-gray-900">{orderDetailModal.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Product</p>
                  <p className="text-sm font-semibold text-gray-900">{orderDetailModal.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="text-sm font-semibold text-gray-900">{orderDetailModal.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Placed</p>
                  <p className="text-sm font-semibold text-gray-900">{orderDetailModal.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery</p>
                  <p className="text-sm font-semibold text-gray-900">{orderDetailModal.deliveryDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="text-sm font-semibold text-gray-900">{orderDetailModal.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-base font-semibold text-gray-900">{orderDetailModal.total}</p>
                </div>
              </div>

              {orderDetailModal.trackingNumber && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                  Tracking number: <span className="font-semibold">{orderDetailModal.trackingNumber}</span>
                </div>
              )}

              {orderDetailModal.notes && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                  <p className="font-semibold text-gray-900">Notes</p>
                  <p className="mt-2 text-gray-600">{orderDetailModal.notes}</p>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Download Invoice
                </button>
                {orderDetailModal.trackingNumber && (
                  <button
                    type="button"
                    onClick={() => handleTrackOrder(orderDetailModal)}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
                  >
                    Track Shipment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
