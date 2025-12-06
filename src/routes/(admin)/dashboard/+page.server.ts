import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { product, store, transaction } from '$lib/server/db/schema';

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

  const rawTransactions = await db
    .select({
      id: transaction.id,
      totalAmount: transaction.totalAmount,
      createdAt: transaction.createdAt
    })
    .from(transaction);

  // ✅ Ensure createdAt is a Date object
  const transactions = rawTransactions.map((t) => ({
    ...t,
    createdAt: new Date(t.createdAt)
  }));

  // ✅ Kiosk products (hardcoded catalog)
  const kioskProducts = [
    { id: '1', name: 'Watercolor Set', price: '499', description: 'Portable watercolor set for beginners and pros.', imageUrl: '/images/watercolor.jpg' },
    { id: '2', name: 'Paint Brushes', price: '249', description: 'High-quality brushes for acrylic and oil painting.', imageUrl: '/images/brushes.jpg' },
    { id: '3', name: 'Canvas Board', price: '299', description: 'Premium canvas board for painting projects.', imageUrl: '/images/canvas.jpg' },
    { id: '4', name: 'Sketch Pad', price: '199', description: 'Acid-free sketch pad for dry media.', imageUrl: '/images/sketchpad.jpg' },
    { id: '5', name: 'Acrylic Paint Set', price: '899', description: 'Vibrant acrylics for mixed media artwork.', imageUrl: '/images/acrylic.jpg' },
    { id: '6', name: 'Charcoal Sticks', price: '150', description: 'Professional charcoal for expressive drawing.', imageUrl: '/images/charcoal.jpg' },
    { id: '7', name: 'Kneaded Eraser', price: '99', description: 'Moldable eraser for graphite and charcoal.', imageUrl: '/images/eraser.jpg' },
    { id: '8', name: 'Round Brush Set', price: '350', description: 'Fine brushes for watercolor and gouache.', imageUrl: '/images/roundbrush.jpg' },
    { id: '9', name: 'Strathmore Paper', price: '399', description: 'Heavyweight paper for professional results.', imageUrl: '/images/strathmore.jpg' },
    { id: '10', name: 'Oil Paint Starter Kit', price: '1200', description: 'Complete set of oil paints for beginners.', imageUrl: '/images/oilpaint.jpg' },
    { id: '11', name: 'Palette Knives', price: '299', description: 'Durable palette knives for mixing and texturing paint.', imageUrl: '/images/paletteknives.jpg' },
    { id: '12', name: 'Easel Stand', price: '1500', description: 'Adjustable wooden easel for studio and outdoor painting.', imageUrl: '/images/easel.jpg' },
    { id: '13', name: 'Gouache Paint Set', price: '799', description: 'Opaque gouache paints for vibrant illustrations.', imageUrl: '/images/gouache.jpg' },
    { id: '14', name: 'Ink Pen Set', price: '450', description: 'Fine ink pens for line art and calligraphy.', imageUrl: '/images/inkpens.jpg' },
    { id: '15', name: 'Pastel Colors', price: '600', description: 'Soft pastels for blending and shading.', imageUrl: '/images/pastels.jpg' }
  ];

  // ✅ Merge DB products with kiosk catalog
  const allProducts = [...products, ...kioskProducts];

  return {
    products: allProducts,
    stores,
    transactions
  };
};
