import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { transaction, transactionItems, payment } from '$lib/server/db/schema';
import { randomUUID } from 'crypto';

export const actions: Actions = {
  checkout: async ({ request }) => {
    const form = await request.formData();
    const itemsRaw = form.getAll('items[]'); // array of JSON strings
    const payMethod = String(form.get('payMethod') ?? '').trim();
    const payAmount = Number(form.get('payAmount') ?? 0);

    const cashierId = 'cashier-001'; // replace with session user id
    const storeId = 'store-001';     // replace with current store context

    if (!itemsRaw.length || !payMethod || payAmount <= 0) {
      return { success: false, error: 'Cart items and payment are required.' };
    }

    // Parse items
    const items = itemsRaw.map((raw) => JSON.parse(String(raw)));

    // Create transaction
    const txId = randomUUID();
    await db.insert(transaction).values({
      id: txId,
      cashierId,
      storeId,
      transactionType: 'Sale',
      totalAmount: payAmount.toString(),
      createdAt: new Date()
    });

    // Insert all items
    for (const item of items) {
      await db.insert(transactionItems).values({
        id: randomUUID(),
        transactionId: txId,
        productId: item.id,
        quantity: item.qty,
        price: item.price
      });
    }

    // Insert payment record
    await db.insert(payment).values({
      id: randomUUID(),
      transactionId: txId,
      method: payMethod,
      amount: payAmount.toString(),
      status: 'Completed'
    });

    return { success: true, message: `Transaction ${txId} created`, txId, items, payAmount, payMethod };
  }
};
