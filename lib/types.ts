/* ═══════════════════════════════════════════════════════════
   Shared TypeScript types for FoodieHub frontend
   Used across: admin, menu, cart, checkout, deals
   ═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   User & Auth
   ───────────────────────────────────────────── */
export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar_url?: string | null;
};

/* ─────────────────────────────────────────────
   Categories
   ───────────────────────────────────────────── */
export type Category = {
  id: number;
  name: string;
  slug: string;
  icon: string;             // emoji
  icon_url: string | null;  // uploaded image URL
  sort_order: number;
  product_count?: number;
  created_at?: string;
  updated_at?: string;
};

/* ─────────────────────────────────────────────
   Product Variants (Small / Medium / Large)
   ───────────────────────────────────────────── */
export type ProductVariant = {
  id: number;
  product_id?: number;
  label: string;
  price: number;
  is_default?: boolean;
  sort_order?: number;
};

/* ─────────────────────────────────────────────
   Products
   ───────────────────────────────────────────── */
export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  long_desc: string;
  price: number;
  old_price: number | null;
  category_id: number;
  img: string;
  rating: number;
  reviews: number;
  time: string;
  calories: number;
  serves: string;
  ingredients: string[];

  veg: boolean;
  spicy: boolean;
  popular: boolean;
  available: boolean;

  /* Per-product fees (admin-controlled) */
  delivery_fee: number;
  tax_percent: number | string; // NUMERIC comes back as string from PG

  /* Relations (populated by join in listProducts / getProduct) */
  variants?: ProductVariant[];
  category_name?: string;
  category_slug?: string;
  category_icon?: string;
  category_icon_url?: string | null;

  created_at?: string;
  updated_at?: string;
};

/* ─────────────────────────────────────────────
   Deals & Deal Items
   ───────────────────────────────────────────── */
export type DealItem = {
  id?: number;
  deal_id?: number;
  product_id: number;
  variant_id?: number | null;
  quantity: number;

  /* Snapshots from the join — populated by backend */
  product_name?: string;
  product_price?: number;
  product_img?: string;
  product_available?: boolean;

  variant_label?: string | null;
  variant_price?: number | null;

  sort_order?: number;
};

export type Deal = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  img: string;
  badge: string;
  tag_color: string;   // e.g. "from-orange-500 to-red-500"
  ends_in: string;     // e.g. "2 days"
  category: string;

  /* Pricing */
  base_price: number;    // auto-sum of products
  deal_price: number;    // what customer pays
  delivery_fee: number;
  tax_percent: number | string; // NUMERIC as string from PG

  active: boolean;

  /* Relation */
  items: DealItem[];

  created_at?: string;
  updated_at?: string;
};

/* ─────────────────────────────────────────────
   Cart
   ───────────────────────────────────────────── */
export type CartLine = {
  id: number;                    // cart_items.id (the line, not product id)
  product_id: number | null;     // null when it's a deal
  deal_id: number | null;        // null when it's a product
  variant_id: number | null;
  name: string;                  // product_name or deal title
  variant_label: string | null;
  price: number;                 // unit_price
  oldPrice?: number;
  img: string;
  time: string;
  category: string;              // "deal" for deals
  quantity: number;
  delivery_fee: number;
  tax_percent: number;
};

export type CartSummary = {
  items: CartLine[];
  subtotal: number;
  totalItems: number;
  deliveryFee: number;
  tax: number;
  total: number;
};

/* ─────────────────────────────────────────────
   Orders (for checkout + tracking + admin)
   ───────────────────────────────────────────── */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "card";
export type PaymentStatus = "unpaid" | "paid";

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number | null;
  deal_id: number | null;
  variant_id: number | null;
  product_name: string;
  variant_label: string | null;
  img: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
  deal_items_snapshot?: any | null; // JSONB from backend
};

export type Order = {
  id: number;
  order_token: string;      // public tracking token
  user_id: number | null;
  session_id: string | null;

  /* Customer snapshot */
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  delivery_notes: string | null;

  /* Amounts */
  subtotal: number;
  delivery_fee: number;
  tax: number;
  discount: number;
  total: number;

  /* Status */
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;

  /* Relations */
  items?: OrderItem[];

  created_at: string;
  updated_at?: string;
};

/* ─────────────────────────────────────────────
   Checkout Form Payload
   ───────────────────────────────────────────── */
export type CheckoutPayload = {
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  delivery_notes?: string;
  promo_code?: string;
  payment_method?: PaymentMethod;
};