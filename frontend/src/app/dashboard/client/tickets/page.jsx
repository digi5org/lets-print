"use client";

import TicketsSection from "@/components/dashboards/client/TicketsSection";

const tickets = [
  {
    id: "TCK-2041",
    subject: "Color correction request for brochure",
    status: "Open",
    priority: "high",
    preview: "Please adjust the blue tones to match our brand guidelines...",
    updatedAt: "2 hours ago",
    assignedTo: "Alex Jordan",
    tags: ["Design", "Color"],
  },
  {
    id: "TCK-2037",
    subject: "Invoice clarification for November",
    status: "Closed",
    priority: "low",
    preview: "Invoice INV-2024-1015 shows two line items we would like to review...",
    updatedAt: "1 day ago",
    assignedTo: "Finance Desk",
    tags: ["Billing"],
  },
  {
    id: "TCK-2031",
    subject: "Shipping address update",
    status: "Open",
    priority: "medium",
    preview: "Need to change the delivery address for order ORD-1018 before it ships...",
    updatedAt: "3 days ago",
    assignedTo: "Logistics Team",
    tags: ["Shipping"],
  },
];

export default function TicketsPage() {
  const handleCreateTicket = () => {
    console.log("Create new ticket");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="mt-1 text-sm text-gray-500">View and manage your support conversations</p>
        </div>
      </div>

      <TicketsSection tickets={tickets} onCreateTicket={handleCreateTicket} />
    </div>
  );
}
