export enum UserRole {
  CLIENT = 'client',
  STARTUP_OWNER = 'startup_owner',
  PRODUCTION_OWNER = 'production_owner',
  SUPER_ADMIN = 'super_admin'
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  companyName?: string;
  phone?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  category: string;
  price: number;
  unit: string;
  isActive: boolean;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product?: Product;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PRODUCTION = 'in_production',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Order {
  id: number;
  clientId: number;
  startupOwnerId: number;
  productionOwnerId?: number;
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  client?: User;
  startupOwner?: User;
  productionOwner?: User;
  items?: OrderItem[];
}
