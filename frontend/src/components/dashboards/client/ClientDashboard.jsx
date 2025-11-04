"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BrowseProductsSection from "./BrowseProductsSection";
import DesignLibrarySection from "./DesignLibrarySection";
import InvoicesPaymentsSection from "./InvoicesPaymentsSection";
import MyAccountSection from "./MyAccountSection";
import MyOrdersSection from "./MyOrdersSection";
import SupportSection from "./SupportSection";
import TicketsSection from "./TicketsSection";
import TrackShipmentSection from "./TrackShipmentSection";

const stats = [
  {
    id: "activeOrders",
    title: "Active Orders",
    value: "5",
    change: "2 currently in production",
    indicator: "positive",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M5 11h14M7 15h10M9 19h6" />
      </svg>
    ),
  },
  {
    id: "totalSpend",
    title: "Total Spend (6 mo)",
    value: "$12,450",
    change: "+$1,200 vs. prior period",
    indicator: "positive",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    id: "approvals",
    title: "Awaiting Approval",
    value: "3",
    change: "Design proofs pending",
    indicator: "warning",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 12 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    id: "unpaidInvoices",
    title: "Unpaid Invoices",
    value: "$845",
    change: "2 invoices due",
    indicator: "warning",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M9 11h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.6a2 2 0 0 1 1.4.6l5.4 5.4a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2Z" />
      </svg>
    ),
  },
];

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

const invoices = [
  { id: "INV-2024-1023", orderId: "ORD-1023", date: "2024-12-10", amount: "$450.00", status: "Pending", dueDate: "2024-12-24" },
  { id: "INV-2024-1018", orderId: "ORD-1018", date: "2024-12-08", amount: "$320.00", status: "Pending", dueDate: "2024-12-22" },
  { id: "INV-2024-1015", orderId: "ORD-1015", date: "2024-12-05", amount: "$180.00", status: "Paid", dueDate: "2024-12-19" },
  { id: "INV-2024-1012", orderId: "ORD-1012", date: "2024-12-01", amount: "$290.00", status: "Paid", dueDate: "2024-12-15" },
];

const products = [
  { id: "prod-1", name: "Business Cards", category: "Stationery", price: "From $45", description: "Premium cards with multiple finishes." },
  { id: "prod-2", name: "Flyers", category: "Marketing", price: "From $80", description: "Full color flyers for promotions." },
  { id: "prod-3", name: "Banners", category: "Large Format", price: "From $120", description: "Durable banners for indoor and outdoor use." },
  { id: "prod-4", name: "Brochures", category: "Marketing", price: "From $150", description: "Tri-fold brochures with professional finish." },
  { id: "prod-5", name: "Posters", category: "Marketing", price: "From $95", description: "High-impact posters available in multiple sizes." },
  { id: "prod-6", name: "Stickers", category: "Promotional", price: "From $60", description: "Custom die-cut stickers and labels." },
];

const designs = [
  { id: "des-1", name: "Conference Brochure", category: "Marketing", status: "Approved", updatedAt: "Dec 9, 2024", fileType: "PDF", fileSize: "4.5 MB", version: "1.3", owner: "Maria Lopez" },
  { id: "des-2", name: "Product Launch Flyer", category: "Campaign", status: "Waiting", updatedAt: "Dec 8, 2024", fileType: "AI", fileSize: "12.1 MB", version: "2.0", owner: "Daniel Kim" },
  { id: "des-3", name: "Business Card Set", category: "Stationery", status: "Approved", updatedAt: "Dec 6, 2024", fileType: "PDF", fileSize: "2.2 MB", version: "4.1", owner: "Julia Chen" },
  { id: "des-4", name: "Holiday Posters", category: "Seasonal", status: "Archived", updatedAt: "Nov 20, 2024", fileType: "PSD", fileSize: "18.4 MB", version: "3.0", owner: "Ian Wright" },
  { id: "des-5", name: "Stickers Pack", category: "Promotional", status: "Approved", updatedAt: "Nov 18, 2024", fileType: "EPS", fileSize: "6.9 MB", version: "1.0", owner: "Maria Lopez" },
  { id: "des-6", name: "Event Badge", category: "Events", status: "Waiting", updatedAt: "Nov 14, 2024", fileType: "AI", fileSize: "3.2 MB", version: "2.1", owner: "Daniel Kim" },
];

const supportChannels = [
  { id: "chat", title: "Live chat", description: "Instant help for quick questions and order updates.", availability: "Mon-Fri", cta: "Start chat" },
  { id: "email", title: "Email support", description: "Prefer email? We reply to most requests within a few hours.", availability: "24/7", cta: "Send email" },
  { id: "call", title: "Schedule a call", description: "Book a 15-minute session with a print specialist.", availability: "By appointment", cta: "Book now" },
];

const supportResources = [
  { id: "guide-1", title: "Preparing files for print", updatedAt: "Dec 2024" },
  { id: "guide-2", title: "Understanding order statuses", updatedAt: "Nov 2024" },
  { id: "guide-3", title: "How to manage design approvals", updatedAt: "Nov 2024" },
];

const supportFaqs = [
  { id: "faq-1", question: "How long does production take?", answer: "Standard production time is 3 to 5 business days depending on the product." },
  { id: "faq-2", question: "Can I reorder a previous job?", answer: "Yes. Use the design library or order history to reorder with saved specifications." },
  { id: "faq-3", question: "When will I receive tracking information?", answer: "Tracking details are provided as soon as the order leaves production." },
];

const ticketSeed = [
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

const accountProfile = {
  name: "Jamie Summers",
  email: "jamie.summers@example.com",
  company: "Tech Solutions Inc.",
  tenant: "tech-solutions",
  billing: {
    defaultMethod: "Corporate card ending 4428",
    recipient: "accounts-payable@example.com",
    frequency: "Monthly",
  },
  preferences: {
    requireApproval: true,
  },
  security: {
    lastLogin: "Dec 10, 2024 at 08:42 AM",
    mfaEnabled: true,
    allowedIps: ["192.168.0.12", "192.168.0.13"],
    sessionDuration: "7 days",
  },
};

const sections = [
  { id: "myOrders", label: "My Orders", description: "Monitor order progress and history." },
  { id: "trackShipment", label: "Track Shipment", description: "Follow active deliveries in real time." },
  { id: "designLibrary", label: "Design Library", description: "Manage artwork approvals." },
  { id: "invoices", label: "Invoices & Payments", description: "Handle billing and payments." },
  { id: "browseProducts", label: "Browse Products", description: "Discover print options." },
  { id: "support", label: "Support", description: "Access guides and reach support." },
  { id: "tickets", label: "Tickets", description: "Review support conversations." },
  { id: "myAccount", label: "My Account", description: "Update profile and security." },
];

export default function ClientDashboard({ userName = "Client" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchSection = searchParams?.get("section") ?? null;

  const [activeSection, setActiveSection] = useState(() =>
    sections.some((section) => section.id === searchSection) ? searchSection : "myOrders"
  );
  const [orderDetailModal, setOrderDetailModal] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null);

  const firstName = userName.trim().split(" ")[0] || "Client";

  useEffect(() => {
    if (!searchSection) {
      router.replace("/dashboard/client?section=myOrders", { scroll: false });
      return;
    }

    if (!sections.some((section) => section.id === searchSection)) {
      router.replace("/dashboard/client?section=myOrders", { scroll: false });
      return;
    }

    setActiveSection(searchSection);
  }, [searchSection, router]);

  const indicatorClass = (indicator) => {
    if (indicator === "positive") return "text-green-600";
    if (indicator === "warning") return "text-orange-600";
    return "text-gray-600";
  };

  const selectSection = (sectionId) => {
    router.replace(`/dashboard/client?section=${sectionId}`, { scroll: false });
  };

  const handleTrackOrder = (order) => {
    setTrackingOrder(order);
    selectSection("trackShipment");
  };

  const handleRequestOrder = () => {
    selectSection("browseProducts");
  };

  return (
    <div className="space-y-6">
      <header className="rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-8 text-white shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {firstName}!</h1>
            <p className="mt-1 text-blue-100">Here is the latest activity from your print workspace.</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleRequestOrder}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Order
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("designLibrary")}
              className="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 font-medium text-white transition hover:bg-white/30"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 0 1-.9-7.9A5 5 0 1 1 15.9 6L16 6a5 5 0 0 1 1 9.9M15 13l-3-3m0 0-3 3m3-3v12" />
              </svg>
              Upload Design
            </button>
          </div>
        </div>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              {stat.icon}
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p className={`mt-2 text-xs font-medium ${indicatorClass(stat.indicator)}`}>{stat.change}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <nav className="flex flex-wrap gap-2 border-b border-gray-200 px-4 py-3" aria-label="Client dashboard sections">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => selectSection(section.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeSection === section.id
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>

        <div className="p-6">
          {activeSection === "myOrders" && (
            <MyOrdersSection
              orders={orders}
              onViewOrder={(order) => setOrderDetailModal(order)}
              onTrackOrder={handleTrackOrder}
            />
          )}

          {activeSection === "trackShipment" && (
            <TrackShipmentSection
              orders={orders}
              selectedOrder={trackingOrder}
              onSelectOrder={(order) => setTrackingOrder(order)}
            />
          )}

          {activeSection === "designLibrary" && (
            <DesignLibrarySection designs={designs} onRequestOrder={handleRequestOrder} />
          )}

          {activeSection === "invoices" && <InvoicesPaymentsSection invoices={invoices} />}

          {activeSection === "browseProducts" && (
            <BrowseProductsSection products={products} onOrderProduct={(product) => console.log("Order product", product)} />
          )}

          {activeSection === "support" && (
            <SupportSection channels={supportChannels} resources={supportResources} faqs={supportFaqs} />
          )}

          {activeSection === "tickets" && (
            <TicketsSection tickets={ticketSeed} onCreateTicket={() => console.log("Create ticket")} />
          )}

          {activeSection === "myAccount" && <MyAccountSection profile={accountProfile} />}
        </div>
      </section>

      {orderDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900">Order details</h2>
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
                  Download invoice
                </button>
                {orderDetailModal.trackingNumber && (
                  <button
                    type="button"
                    onClick={() => handleTrackOrder(orderDetailModal)}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
                  >
                    Track shipment
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
