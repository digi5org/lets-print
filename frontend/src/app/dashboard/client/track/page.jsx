"use client";

import { useState } from "react";
import TrackShipmentSection from "@/components/dashboards/client/TrackShipmentSection";

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
];

export default function TrackShipmentPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Track Shipment</h1>
          <p className="mt-1 text-sm text-gray-500">Track your order delivery status in real-time</p>
        </div>
      </div>

      <TrackShipmentSection
        orders={orders}
        selectedOrder={selectedOrder}
        onSelectOrder={setSelectedOrder}
      />
    </div>
  );
}
