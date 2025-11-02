export type UserRole = "client" | "business_owner" | "production_owner" | "superadmin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  roles: UserRole[];
}
