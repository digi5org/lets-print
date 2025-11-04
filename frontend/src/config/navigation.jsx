"use client";

// SVG Icons as components
const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const OrdersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ProductionIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BusinessIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

export const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard/client",
    icon: <HomeIcon />,
    roles: ["client"],
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <HomeIcon />,
    roles: ["business_owner", "production_owner", "superadmin"],
  },
  {
    name: "New Order",
    href: "/dashboard/client/products",
    icon: <OrdersIcon />,
    roles: ["client"],
  },
  {
    name: "My Orders",
    href: "/dashboard/client/orders",
    icon: <OrdersIcon />,
    roles: ["client"],
    badge: 5,
  },
  {
    name: "Track Shipment",
    href: "/dashboard/client/track",
    icon: <ProductionIcon />,
    roles: ["client"],
  },
  {
    name: "Design Library",
    href: "/dashboard/client/designs",
    icon: <AnalyticsIcon />,
    roles: ["client"],
  },
  {
    name: "Invoices & Payments",
    href: "/dashboard/client/invoices",
    icon: <BusinessIcon />,
    roles: ["client"],
  },
  {
    name: "Browse Products",
    href: "/dashboard/client/products",
    icon: <ProductionIcon />,
    roles: ["client"],
  },
  {
    name: "Support",
    href: "/dashboard/client/support",
    icon: <UsersIcon />,
    roles: ["client"],
  },
  {
    name: "Tickets",
    href: "/dashboard/client/tickets",
    icon: <OrdersIcon />,
    roles: ["client"],
    badge: 2,
  },
  {
    name: "My Account",
    href: "/dashboard/client/account",
    icon: <SettingsIcon />,
    roles: ["client"],
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: <OrdersIcon />,
    roles: ["business_owner", "production_owner"],
  },
  {
    name: "Clients",
    href: "/dashboard/clients",
    icon: <UsersIcon />,
    roles: ["business_owner"],
  },
  {
    name: "Businesses",
    href: "/dashboard/businesses",
    icon: <BusinessIcon />,
    roles: ["production_owner", "superadmin"],
  },
  {
    name: "Production",
    href: "/dashboard/production",
    icon: <ProductionIcon />,
    roles: ["production_owner"],
  },
  {
    name: "All Users",
    href: "/dashboard/users",
    icon: <UsersIcon />,
    roles: ["superadmin"],
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: <AnalyticsIcon />,
    roles: ["business_owner", "production_owner", "superadmin"],
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: <SettingsIcon />,
    roles: ["business_owner", "production_owner", "superadmin"],
  },
];

export function getNavigationForRole(role) {
  return navigationItems.filter((item) => item.roles.includes(role));
}
