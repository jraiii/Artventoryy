import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { product } from '$lib/server/db/schema';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
  const products = await db
    .select({
      id: product.id,
      name: product.productName,
      price: product.price,
      imageUrl: product.imageUrl
    })
    .from(product);

  return { products };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const form = await request.formData();
    const name = String(form.get('name') ?? '').trim();
    const price = String(form.get('price') ?? '').trim();

    if (!name || !price) {
      return { success: false, error: 'Missing fields.' };
    }

    await db.insert(product).values({
      id: randomUUID(),
      productName: name,
      price,
      imageUrl: null
    });

    return { success: true };
  },

  update: async ({ request }) => {
    const form = await request.formData();
    const id = String(form.get('id') ?? '');
    const name = String(form.get('name') ?? '').trim();
    const price = String(form.get('price') ?? '').trim();

    if (!id || !name || !price) {
      return { success: false, error: 'Missing fields.' };
    }

    await db.update(product)
      .set({ productName: name, price })
      .where(eq(product.id, id));

    return { success: true };
  },

  delete: async ({ request }) => {
    const form = await request.formData();
    const id = String(form.get('id') ?? '');
    if (!id) return { success: false, error: 'Missing product id.' };

    await db.delete(product).where(eq(product.id, id));
    return { success: true };
  }
};
