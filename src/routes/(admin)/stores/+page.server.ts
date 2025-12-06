import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { store } from '$lib/server/db/schema';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

// Hardcoded Balanga art supply stores (mock/demo data)
const balangaStores = [
  {
    id: 'b1',
    storeName: 'Balanga Art Depot',
    address: 'Capitol Drive, Balanga City, Bataan',
    contactNo: '0917-123-4567',
    ownerId: 'kiosk-owner'
  },
  {
    id: 'b2',
    storeName: 'Creative Corner Balanga',
    address: 'Enrique Garcia Ave, Balanga City',
    contactNo: '0917-987-6543',
    ownerId: 'kiosk-owner'
  },
  {
    id: 'b3',
    storeName: 'Color Palette Supplies',
    address: 'Plaza Mayor de Balanga, Bataan',
    contactNo: '0921-555-7890',
    ownerId: 'kiosk-owner'
  }
];

export const load: PageServerLoad = async () => {
  const dbStores = await db.select().from(store).orderBy(store.storeName);
  const stores = [...dbStores, ...balangaStores];
  return { stores };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const form = await request.formData();
    const storeName = String(form.get('storeName') ?? '').trim();
    const address = String(form.get('address') ?? '').trim();
    const contactNo = String(form.get('contactNo') ?? '').trim();

    if (!storeName) {
      return { success: false, error: 'Store name is required.' };
    }

    await db.insert(store).values({
      id: randomUUID(),
      ownerId: 'default-owner', // replace with actual ownerId
      storeName,
      address,
      contactNo
    });

    return { success: true };
  },

  update: async ({ request }) => {
    const form = await request.formData();
    const id = String(form.get('id') ?? '');
    const storeName = String(form.get('storeName') ?? '').trim();
    const address = String(form.get('address') ?? '').trim();
    const contactNo = String(form.get('contactNo') ?? '').trim();

    if (!id || !storeName) {
      return { success: false, error: 'Missing fields for update.' };
    }

    await db.update(store)
      .set({ storeName, address, contactNo })
      .where(eq(store.id, id));

    return { success: true };
  },

  delete: async ({ request }) => {
    const form = await request.formData();
    const id = String(form.get('id') ?? '');
    if (!id) return { success: false, error: 'Missing store id.' };

    await db.delete(store).where(eq(store.id, id));
    return { success: true };
  }
};
