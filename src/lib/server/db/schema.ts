import {
  pgTable,
  timestamp,
  text,
  pgEnum,
  decimal,
  integer,
  varchar,
  boolean
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- ENUMS ---
const userRoles = ['admin', 'cashier', 'manager', 'owner'] as const;
export type UserRole = (typeof userRoles)[number];
export const userRole = pgEnum('role', userRoles);

const transactionTypes = ['Sale', 'Refund', 'Void'] as const;
export type TransactionType = (typeof transactionTypes)[number];
export const transactionType = pgEnum('transaction_type', transactionTypes);

const paymentMethods = ['Cash', 'GCash', 'CreditCard', 'DebitCard'] as const;
export type PaymentMethod = (typeof paymentMethods)[number];
export const paymentMethod = pgEnum('payment_method', paymentMethods);

const paymentStatuses = ['Pending', 'Paid', 'Refunded'] as const;
export type PaymentStatus = (typeof paymentStatuses)[number];
export const paymentStatus = pgEnum('payment_status', paymentStatuses);

// --- TABLES ---
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  fullname: text('fullname').notNull(),
  email: text('email').notNull().unique(),
  contactNo: text('contact_no'),
  hashedPassword: text('hashed_password').notNull(),
  role: userRole('role').notNull(),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const store = pgTable('store', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  storeName: text('store_name').notNull(),
  address: text('address'),
  contactNo: text('contact_no'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Category table
export const category = pgTable('category', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const product = pgTable('product', {
  id: text('id').primaryKey(),
  storeId: text('store_id').notNull().references(() => store.id, { onDelete: 'cascade' }),
  categoryId: text('category_id').notNull().references(() => category.id, { onDelete: 'cascade' }),
  productName: text('product_name').notNull(),
  barcode: varchar('barcode', { length: 50 }).unique(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stockQty: integer('stock_qty').notNull().default(0),
  imageUrl: text('image_url'), // ✅ NEW COLUMN for product images
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const transaction = pgTable('transaction', {
  id: text('id').primaryKey(),
  cashierId: text('cashier_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  storeId: text('store_id').notNull().references(() => store.id, { onDelete: 'cascade' }),
  transactionType: transactionType('transaction_type').notNull().default('Sale'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const transactionItems = pgTable('transaction_items', {
  id: text('id').primaryKey(),
  transactionId: text('transaction_id').notNull().references(() => transaction.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => product.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(), // price at the time of sale
});

export const payment = pgTable('payment', {
  id: text('id').primaryKey(),
  transactionId: text('transaction_id').notNull().references(() => transaction.id, { onDelete: 'cascade' }),
  method: paymentMethod('method').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: paymentStatus('status').default('Pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- RELATIONS ---
export const storeRelations = relations(store, ({ one, many }) => ({
  owner: one(user, {
    fields: [store.ownerId],
    references: [user.id],
  }),
  products: many(product),
  transactions: many(transaction),
}));

export const categoryRelations = relations(category, ({ many }) => ({
  products: many(product),
}));

export const productRelations = relations(product, ({ one, many }) => ({
  store: one(store, {
    fields: [product.storeId],
    references: [store.id],
  }),
  category: one(category, {
    fields: [product.categoryId],
    references: [category.id],
  }),
  transactionItems: many(transactionItems),
}));

export const transactionRelations = relations(transaction, ({ one, many }) => ({
  cashier: one(user, {
    fields: [transaction.cashierId],
    references: [user.id],
  }),
  store: one(store, {
    fields: [transaction.storeId],
    references: [store.id],
  }),
  items: many(transactionItems),
  payments: many(payment),
}));

export const transactionItemsRelations = relations(transactionItems, ({ one }) => ({
  transaction: one(transaction, {
    fields: [transactionItems.transactionId],
    references: [transaction.id],
  }),
  product: one(product, {
    fields: [transactionItems.productId],
    references: [product.id],
  }),
}));

export const paymentRelations = relations(payment, ({ one }) => ({
  transaction: one(transaction, {
    fields: [payment.transactionId],
    references: [transaction.id],
  }),
}));
