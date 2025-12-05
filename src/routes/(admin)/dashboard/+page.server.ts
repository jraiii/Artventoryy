import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { product, store, transaction } from '$lib/server/db/schema';

// Dashboard only loads data — no product create/delete here
export const load: PageServerLoad = async () => {
  const products = await db
    .select({
      id: product.id,
      name: product.productName,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl
    })
    .from(product);

  const stores = await db
    .select({
      id: store.id,
      name: store.storeName
    })
    .from(store);

  // Example: aggregate transactions for sales graph
  const transactions = await db
    .select({
      id: transaction.id,
      totalAmount: transaction.totalAmount,
      createdAt: transaction.createdAt
    })
    .from(transaction);

  return { products, stores, transactions };
};
