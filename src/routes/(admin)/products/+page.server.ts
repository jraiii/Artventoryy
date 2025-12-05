import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { product, category } from '$lib/server/db/schema';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

export const load: PageServerLoad = async () => {
  const products = await db.select().from(product).orderBy(product.productName);
  const categories = await db.select().from(category).orderBy(category.name);
  return { products, categories };
};

export const actions: Actions = {
  create: async ({ request }) => {
    try {
      const form = await request.formData();
      const productName = String(form.get('productName') ?? '').trim();
      const price = String(form.get('price') ?? '').trim();
      const stockQty = Number(form.get('stockQty') ?? 0);
      const categoryId = String(form.get('categoryId') ?? '').trim();
      const image = form.get('image') as File | null;

      if (!productName || !price || !categoryId) {
        return { success: false, error: 'Product name, price, and category are required.' };
      }

      let imageUrl: string | undefined;
      if (image) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const fileName = `${Date.now()}-${image.name}`;
        const filePath = path.join('static/uploads', fileName);

        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, buffer);
        imageUrl = `/uploads/${fileName}`;
      }

      await db.insert(product).values({
        id: randomUUID(),
        storeId: 'default-store', // replace with actual storeId
        categoryId,
        productName,
        price,
        stockQty,
        imageUrl
      });

      return { success: true };
    } catch (err) {
      console.error('Create error:', err);
      return { success: false, error: 'Something went wrong while creating the product.' };
    }
  },

  update: async ({ request }) => {
    try {
      const form = await request.formData();
      const id = String(form.get('id') ?? '');
      const productName = String(form.get('productName') ?? '').trim();
      const price = String(form.get('price') ?? '').trim();
      const stockQty = Number(form.get('stockQty') ?? 0);
      const categoryId = String(form.get('categoryId') ?? '').trim();
      const image = form.get('image') as File | null;

      if (!id || !productName || !price || !categoryId) {
        return { success: false, error: 'Missing fields for update.' };
      }

      let imageUrl: string | undefined;
      if (image && image.size > 0) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const fileName = `${Date.now()}-${image.name}`;
        const filePath = path.join('static/uploads', fileName);

        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, buffer);
        imageUrl = `/uploads/${fileName}`;
      }

      await db.update(product)
        .set({ productName, price, stockQty, categoryId, ...(imageUrl ? { imageUrl } : {}) })
        .where(eq(product.id, id));

      return { success: true };
    } catch (err) {
      console.error('Update error:', err);
      return { success: false, error: 'Something went wrong while updating the product.' };
    }
  },

  delete: async ({ request }) => {
    try {
      const form = await request.formData();
      const id = String(form.get('id') ?? '');
      if (!id) return { success: false, error: 'Missing product id.' };

      await db.delete(product).where(eq(product.id, id));
      return { success: true };
    } catch (err) {
      console.error('Delete error:', err);
      return { success: false, error: 'Something went wrong while deleting the product.' };
    }
  }
};
