import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { transaction, transactionItems, payment } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
  // Fetch the most recent transaction
  const [lastTx] = await db
    .select()
    .from(transaction)
    .orderBy(transaction.createdAt, 'desc')
    .limit(1);

  if (!lastTx) {
    return { lastTransaction: null };
  }

  const items = await db
    .select()
    .from(transactionItems)
    .where(transactionItems.transactionId.eq(lastTx.id));

  const payments = await db
    .select()
    .from(payment)
    .where(payment.transactionId.eq(lastTx.id));

  return {
    lastTransaction: {
      ...lastTx,
      items,
      payments
    }
  };
};
