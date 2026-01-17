import { pgTable, serial, text, boolean, integer, json, timestamp, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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

export const whitelabelModels = pgTable('whitelabel_models', {
  id: serial('id').primaryKey(),
  folderName: text('folder_name').notNull().unique(), 
  thumbnailUrl: text('thumbnail_url'),
  postCount: integer('post_count').default(0),
  status: text('status', { enum: ['new', 'active', 'hidden'] }).default('new'),
  lastSyncedAt: timestamp('last_synced_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const whitelabelModelsRelations = relations(whitelabelModels, ({ many }) => ({
  posts: many(whitelabelPosts),
}));

export const whitelabelPosts = pgTable('whitelabel_posts', {
  id: serial('id').primaryKey(),
  whitelabelModelId: integer('whitelabel_model_id').references(() => whitelabelModels.id, { onDelete: 'cascade' }).notNull(),
  folderName: text('folder_name').notNull(),
  title: text('title'),
  mediaCdns: json('media_cdns'),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  unq: unique().on(t.whitelabelModelId, t.folderName),
}));

export const whitelabelPostsRelations = relations(whitelabelPosts, ({ one, many }) => ({
  model: one(whitelabelModels, {
    fields: [whitelabelPosts.whitelabelModelId],
    references: [whitelabelModels.id],
  }),
  media: many(whitelabelMedia),
}));

export const whitelabelMedia = pgTable('whitelabel_media', {
  id: serial('id').primaryKey(),
  whitelabelPostId: integer('whitelabel_post_id').references(() => whitelabelPosts.id, { onDelete: 'cascade' }).notNull(),
  s3Key: text('s3_key').notNull().unique(),
  url: text('url'), 
  type: text('type', { enum: ['image', 'video'] }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const whitelabelMediaRelations = relations(whitelabelMedia, ({ one }) => ({
  post: one(whitelabelPosts, {
    fields: [whitelabelMedia.whitelabelPostId],
    references: [whitelabelPosts.id],
  }),
}));
