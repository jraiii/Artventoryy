import { writable } from 'svelte/store';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  description?: string;
};

export const cart = writable<CartItem[]>([]);
export const receipt = writable<string | null>(null);
export const confirmed = writable(false);
export const orderNumber = writable<string | null>(null);
export const timestamp = writable<string | null>(null);
export const paymentMethod = writable<string | null>(null);
