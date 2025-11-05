"use client";

import BrowseProductsSection from "@/components/dashboards/client/BrowseProductsSection";

const products = [
  { id: "prod-1", name: "Business Cards", category: "Stationery", price: "From $45", description: "Premium cards with multiple finishes." },
  { id: "prod-2", name: "Flyers", category: "Marketing", price: "From $80", description: "Full color flyers for promotions." },
  { id: "prod-3", name: "Banners", category: "Large Format", price: "From $120", description: "Durable banners for indoor and outdoor use." },
  { id: "prod-4", name: "Brochures", category: "Marketing", price: "From $150", description: "Tri-fold brochures with professional finish." },
  { id: "prod-5", name: "Posters", category: "Marketing", price: "From $95", description: "High-impact posters available in multiple sizes." },
  { id: "prod-6", name: "Stickers", category: "Promotional", price: "From $60", description: "Custom die-cut stickers and labels." },
];

export default function BrowseProductsPage() {
  const handleOrderProduct = (product) => {
    console.log("Order product:", product);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Products</h1>
          <p className="mt-1 text-sm text-gray-500">Explore our full catalog of printing services and products</p>
        </div>
      </div>

      <BrowseProductsSection products={products} onOrderProduct={handleOrderProduct} />
    </div>
  );
}
