export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name?: string;
  address?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  name_az: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  requires_prescription: boolean;
  in_stock: boolean;
  created_at: string;
}

export interface CartItem {
  product_id: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total: number;
  delivery_address?: string;
  latitude?: number;
  longitude?: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "delivering"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export type ChannelSource = "web" | "telegram" | "whatsapp";

export interface PrescriptionAnalysis {
  medications: string[];
  matched_products: Product[];
  summary: string;
}
