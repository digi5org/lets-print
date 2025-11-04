"use client";

import DesignLibrarySection from "@/components/dashboards/client/DesignLibrarySection";

const designs = [
  { id: "des-1", name: "Conference Brochure", category: "Marketing", status: "Approved", updatedAt: "Dec 9, 2024", fileType: "PDF", fileSize: "4.5 MB", version: "1.3", owner: "Maria Lopez" },
  { id: "des-2", name: "Product Launch Flyer", category: "Campaign", status: "Waiting", updatedAt: "Dec 8, 2024", fileType: "AI", fileSize: "12.1 MB", version: "2.0", owner: "Daniel Kim" },
  { id: "des-3", name: "Business Card Set", category: "Stationery", status: "Approved", updatedAt: "Dec 6, 2024", fileType: "PDF", fileSize: "2.2 MB", version: "4.1", owner: "Julia Chen" },
  { id: "des-4", name: "Holiday Posters", category: "Seasonal", status: "Archived", updatedAt: "Nov 20, 2024", fileType: "PSD", fileSize: "18.4 MB", version: "3.0", owner: "Ian Wright" },
  { id: "des-5", name: "Stickers Pack", category: "Promotional", status: "Approved", updatedAt: "Nov 18, 2024", fileType: "EPS", fileSize: "6.9 MB", version: "1.0", owner: "Maria Lopez" },
  { id: "des-6", name: "Event Badge", category: "Events", status: "Waiting", updatedAt: "Nov 14, 2024", fileType: "AI", fileSize: "3.2 MB", version: "2.1", owner: "Daniel Kim" },
];

export default function DesignLibraryPage() {
  const handleRequestOrder = () => {
    console.log("Request order from design");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Design Library</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and organize your design files and artwork</p>
        </div>
      </div>

      <DesignLibrarySection designs={designs} onRequestOrder={handleRequestOrder} />
    </div>
  );
}
