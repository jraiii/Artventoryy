import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { product, category } from '$lib/server/db/schema';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

// Utility: random stock quantity for kiosk products
function randomQty(min = 5, max = 50) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const load: PageServerLoad = async () => {
  const products = await db.select().from(product).orderBy(product.productName);
  const categories = await db.select().from(category).orderBy(category.name);

  // Kiosk catalog (mock) with random stock quantities
  const kioskProducts = [
    { id: 'k1', productName: 'Watercolor Set', price: '499', stockQty: randomQty(), categoryId: 'art', imageUrl: '/images/watercolor.jpg' },
    { id: 'k2', productName: 'Paint Brushes', price: '249', stockQty: randomQty(), categoryId: 'art', imageUrl: '/images/brushes.jpg' },
    { id: 'k3', productName: 'Canvas Board', price: '299', stockQty: randomQty(), categoryId: 'art', imageUrl: '/images/canvas.jpg' },
    { id: 'k4', productName: 'Sketch Pad', price: '199', stockQty: randomQty(), categoryId: 'art', imageUrl: '/images/sketchpad.jpg' },
    { id: 'k5', productName: 'Acrylic Paint Set', price: '899', stockQty: randomQty(), categoryId: 'art', imageUrl: '/images/acrylic.jpg' },
    { id: 'k6', productName: 'Charcoal Sticks', price: '150', stockQty: randomQty(), categoryId: 'art', imageUrl: '/images/charcoal.jpg' },
    { id: 'k7', productName: 'Kneaded Eraser', price: '99', stockQty: randomQty(), categoryId: 'art', imageUrl: '/images/eraser.jpg' },
    { id: 'k8', productName: 'Round Brush Set', price: '350', stockQty: randomQty(), categoryId: 'art', imageUrl: '/images/roundbrush.jpg' },
    { id: 'k9', productName: 'Strathmore Paper', price: '399', stockQty: randomQty(), categoryId: 'art', imageUrl: '/images/strathmore.jpg' },
    { id: 'k10', productName: 'Oil Paint Starter Kit', price: '1200', stockQty: randomQty(), categoryId: 'art', imageUrl: '/images/oilpaint.jpg' },
    { id: 'k11', productName: 'Palette Knives', price: '299', stockQty: randomQty(), categoryId: 'art', imageUrl: '/images/paletteknives.jpg' },
    { id: 'k12', productName: 'Easel Stand', price: '1500', stockQty: randomQty(), categoryId: 'art', imageUrl: '/images/easel.jpg' },
    { id: 'k13', productName: 'Gouache Paint Set', price: '799', stockQty: randomQty(), categoryId: 'art', imageUrl: '/images/gouache.jpg' },
    { id: 'k14', productName: 'Ink Pen Set', price: '450', stockQty: randomQty(), categoryId: 'art', imageUrl: '/images/inkpens.jpg' },
    { id: 'k15', productName: 'Pastel Colors', price: '600', stockQty: randomQty(), categoryId: 'art', imageUrl: '/images/pastels.jpg' }
  ];

  const allProducts = [...products, ...kioskProducts];

  return { products: allProducts, categories };
};

export const actions: Actions = {
  create: async ({ request }) => {
    try {
      const form = await request.formData();
      const productName = String(form.get('productName') ?? '').trim();
      const price = String(form.get('price') ?? '').trim(); // Drizzle column likely text/varchar
      const stockQty = Number(form.get('stockQty') ?? 0);
      const categoryId = String(form.get('categoryId') ?? '').trim();
      const image = form.get('image') as File | null;

      if (!productName || !price || !categoryId) {
        return { success: false, error: 'Product name, price, and category are required.' };
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

      // Align with schema column names; if your schema uses a different id column, change here
      await db.insert(product).values({
        id: randomUUID(),
        storeId: 'default-store',
        categoryId,
        productName,
        price, // string to satisfy varchar/text column
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
      const id = String(form.get('id') ?? '').trim();
      const productName = String(form.get('productName') ?? '').trim();
      const price = String(form.get('price') ?? '').trim(); // keep string for schema
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

      await db
        .update(product)
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
      const id = String(form.get('id') ?? '').trim();
      if (!id) return { success: false, error: 'Missing product id.' };

      await db.delete(product).where(eq(product.id, id));
      return { success: true };
    } catch (err) {
      console.error('Delete error:', err);
      return { success: false, error: 'Something went wrong while deleting the product.' };
    }
  }
};
