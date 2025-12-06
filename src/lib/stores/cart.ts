import { writable, derived } from 'svelte/store';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  description?: string;
};

// 🛒 Cart contents
export const cart = writable<CartItem[]>([]);

// 💳 Checkout state
export const discountType = writable<'none' | 'senior' | 'pwd' | 'vat'>('none');
export const paymentMethod = writable<'gcash' | 'maya' | 'card' | 'cash'>('gcash');
export const receivedAmount = writable<number>(0);

// 📊 Derived totals
export const subtotal = derived(cart, ($cart: CartItem[]) =>
  $cart.reduce((sum: number, item: CartItem) => sum + item.price * item.qty, 0)
);

export const discount = derived([subtotal, discountType], ([$subtotal, $discountType]) => {
  switch ($discountType) {
    case 'senior':
    case 'pwd':
      return $subtotal * 0.20; // 20% off
    case 'vat':
      return $subtotal * 0.12; // 12% off
    default:
      return 0;
  }
});

export const total = derived([subtotal, discount], ([$subtotal, $discount]) =>
  Math.max(0, $subtotal - $discount)
);

export const change = derived(
  [paymentMethod, receivedAmount, total],
  ([$paymentMethod, $receivedAmount, $total]) =>
    $paymentMethod === 'cash' ? Math.max(0, $receivedAmount - $total) : 0
);

// 📑 Order metadata
export const receipt = writable<string | null>(null);
export const confirmed = writable(false);
export const orderNumber = writable<string | null>(null);
export const timestamp = writable<string | null>(null);

// ✅ Helper: confirm order
export function confirmOrder() {
  confirmed.set(true);
  orderNumber.set(`ORD-${Date.now()}`);
  timestamp.set(new Date().toISOString());
}
