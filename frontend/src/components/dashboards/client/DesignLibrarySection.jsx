import { useState } from "react";

export default function DesignLibrarySection({ designs = [], onRequestOrder }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  const fileInputAccept = ".pdf,.ai,.psd,.eps,.jpg,.png";

  const filteredDesigns = designs.filter((design) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "approved") return design.status === "Approved";
    if (activeFilter === "awaiting") return design.status === "Waiting";
    if (activeFilter === "archived") return design.status === "Archived";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">Design Library</h3>
          <p className="text-sm text-gray-500">
            Store artwork files, approvals, and ready-to-print assets in one place.
          </p>
        </div>
        <div className="flex gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-blue-500 hover:text-blue-600">
            <input
              type="file"
              multiple
              className="hidden"
              accept={fileInputAccept}
              onChange={(event) => {
                const files = Array.from(event.target.files || []);
                setSelectedFiles(files);
              }}
            />
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Files
          </label>
          <button
            type="button"
            onClick={() => onRequestOrder?.()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M5 11h14M7 15h10M9 19h6" />
            </svg>
            Request Print
          </button>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {selectedFiles.length} file{selectedFiles.length === 1 ? "" : "s"} ready to upload.
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto">
        {[
          { id: "all", label: "All" },
          { id: "approved", label: "Approved" },
          { id: "awaiting", label: "Awaiting Review" },
          { id: "archived", label: "Archived" },
        ].map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeFilter === filter.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filteredDesigns.map((design) => (
          <div key={design.id} className="flex h-full flex-col rounded-xl border border-gray-200 bg-white">
            <div className="h-40 rounded-t-xl bg-gradient-to-br from-blue-50 to-gray-100" aria-hidden="true" />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-semibold text-gray-900">{design.name}</h4>
                  <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">{design.category}</p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    design.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : design.status === "Waiting"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {design.status}
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>Updated: {design.updatedAt}</p>
                <p>Format: {design.fileType}</p>
                <p>Size: {design.fileSize}</p>
              </div>
              <div className="mt-auto pt-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Version {design.version}</span>
                  <span>{design.owner}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    onClick={() => onRequestOrder?.(design)}
                    className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Reorder
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredDesigns.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center text-sm text-gray-500">
            No designs match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
