import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { transaction, user, store, payment } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
  // Fetch transactions with cashier and store info
  const transactions = await db
    .select({
      id: transaction.id,
      type: transaction.transactionType,
      totalAmount: transaction.totalAmount,
      createdAt: transaction.createdAt,
      cashierId: transaction.cashierId,
      storeId: transaction.storeId
    })
    .from(transaction);

  // Fetch payments for each transaction
  const payments = await db.select().from(payment);

  // Map payments to transactions
  const transactionsWithPayments = transactions.map(t => {
    const relatedPayments = payments.filter(p => p.transactionId === t.id);
    return { ...t, payments: relatedPayments };
  });

  return { transactions: transactionsWithPayments };
};
