import { useState } from "react";

const priorityClasses = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-gray-200 text-gray-700",
};

export default function TicketsSection({ tickets = [], onCreateTicket }) {
  const [filter, setFilter] = useState("open");

  const visibleTickets = tickets.filter((ticket) => {
    if (filter === "all") return true;
    if (filter === "open") return ticket.status === "Open";
    if (filter === "closed") return ticket.status === "Closed";
    return true;
  });
  

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
          <p className="text-sm text-gray-500">
            Monitor ongoing conversations with the support team or create a new request.
          </p>
        </div>
        <div className="ml-auto flex gap-3">
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500  text-black"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="all">All</option>
          </select>
          <button
            type="button"
            onClick={() => onCreateTicket?.()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Ticket
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {visibleTickets.map((ticket) => (
          <div key={ticket.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-blue-600">{ticket.id}</span>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      ticket.status === "Open" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${priorityClasses[ticket.priority]}`}>
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} priority
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-900">{ticket.subject}</p>
                <p className="mt-1 text-sm text-gray-600">{ticket.preview}</p>
              </div>
              <div className="text-sm text-gray-500">
                <p>Updated {ticket.updatedAt}</p>
                <p className="mt-1">Assigned to {ticket.assignedTo}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
              {ticket.tags.map((tag) => (
                <span key={tag} className="inline-flex rounded-full bg-gray-100 px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
        {visibleTickets.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center text-sm text-gray-500">
            No tickets match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
