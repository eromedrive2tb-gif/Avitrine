import { pgTable, serial, text, boolean, integer, json, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['admin', 'user'] }).default('user'),
  subscriptionStatus: boolean('subscription_status').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const models = pgTable('models', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  iconUrl: text('icon_url'),
  bannerUrl: text('banner_url'),
  isFeatured: boolean('is_featured').default(false),
  isAdvertiser: boolean('is_advertiser').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  modelId: integer('model_id').references(() => models.id),
  title: text('title'),
  contentUrl: text('content_url').notNull(),
  type: text('type', { enum: ['image', 'video'] }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const plans = pgTable('plans', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  price: integer('price').notNull(), // Centavos
  benefits: json('benefits_json'),
  ctaText: text('cta_text'),
  checkoutUrl: text('checkout_url'),
});

export const adminSettings = pgTable('admin_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});
