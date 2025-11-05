"use client";

import InvoicesPaymentsSection from "@/components/dashboards/client/InvoicesPaymentsSection";

const invoices = [
  { id: "INV-2024-1023", orderId: "ORD-1023", date: "2024-12-10", amount: "$450.00", status: "Pending", dueDate: "2024-12-24" },
  { id: "INV-2024-1018", orderId: "ORD-1018", date: "2024-12-08", amount: "$320.00", status: "Pending", dueDate: "2024-12-22" },
  { id: "INV-2024-1015", orderId: "ORD-1015", date: "2024-12-05", amount: "$180.00", status: "Paid", dueDate: "2024-12-19" },
  { id: "INV-2024-1012", orderId: "ORD-1012", date: "2024-12-01", amount: "$290.00", status: "Paid", dueDate: "2024-12-15" },
];

export default function InvoicesPaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices & Payments</h1>
          <p className="mt-1 text-sm text-gray-500">View invoices, payment history, and manage billing</p>
        </div>
      </div>

      <InvoicesPaymentsSection invoices={invoices} />
    </div>
  );
}
