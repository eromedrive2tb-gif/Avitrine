import { pgTable, serial, text, boolean, integer, json, timestamp, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- TABLES ---

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['admin', 'user'] }).default('user'),
  subscriptionStatus: integer('subscription_status').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const plans = pgTable('plans', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  price: integer('price').notNull(), // Centavos
  duration: integer('duration').notNull(), // Em dias
  benefits: json('benefits_json'),
  ctaText: text('cta_text'),
  checkoutUrl: text('checkout_url'),
  // Internal Checkout Flags
  acceptsPix: boolean('accepts_pix').default(true),
  acceptsCard: boolean('accepts_card').default(true),
});

export const paymentGateways = pgTable('payment_gateways', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(), // 'Dias Marketplace' | 'JunglePay'
  publicKey: text('public_key'),
  secretKey: text('secret_key'),
  postbackUrl: text('postback_url'), // URL de webhook/callback para notificações de pagamento
  isActive: boolean('is_active').default(false),
});

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  planId: integer('plan_id').references(() => plans.id),
  externalId: text('external_id'), // ID da transação no gateway
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  status: text('status', { enum: ['active', 'expired', 'pending'] }).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const models = pgTable('models', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique(),
  description: text('description'),
  iconUrl: text('icon_url'),
  thumbnailUrl: text('thumbnail_url'),
  bannerUrl: text('banner_url'),
  externalUrl: text('external_url'),
  category: text('category'),
  postCount: integer('post_count').default(0),
  status: text('status', { enum: ['active', 'hidden', 'draft'] }).default('active'),
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

export const adminSettings = pgTable('admin_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export const whitelabelModels = pgTable('whitelabel_models', {
  id: serial('id').primaryKey(),
  folderName: text('folder_name').notNull().unique(), 
  thumbnailUrl: text('thumbnail_url'),
  iconUrl: text('icon_url'),
  bannerUrl: text('banner_url'),
  postCount: integer('post_count').default(0),
  status: text('status', { enum: ['new', 'active', 'hidden'] }).default('new'),
  lastSyncedAt: timestamp('last_synced_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

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

export const whitelabelMedia = pgTable('whitelabel_media', {
  id: serial('id').primaryKey(),
  whitelabelPostId: integer('whitelabel_post_id').references(() => whitelabelPosts.id, { onDelete: 'cascade' }).notNull(),
  s3Key: text('s3_key').notNull().unique(),
  url: text('url'), 
  type: text('type', { enum: ['image', 'video'] }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const supportContacts = pgTable('support_contacts', {
  id: serial('id').primaryKey(),
  platform: text('platform').notNull(), // 'whatsapp', 'telegram'
  url: text('url').notNull(),
  isActive: boolean('is_active').default(true),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

export const checkouts = pgTable('checkouts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id), // Pode ser nulo se não logado, mas idealmente capturamos
  planId: integer('plan_id').references(() => plans.id).notNull(),
  externalId: text('external_id'), // ID da transação no gateway (JunglePay)
  status: text('status', { enum: ['pending', 'paid', 'failed', 'abandoned'] }).default('pending'),
  paymentMethod: text('payment_method', { enum: ['pix', 'credit_card'] }),
  orderBump: boolean('order_bump').default(false),
  orderBumpIds: json('order_bump_ids'), // Array de IDs das order bumps selecionadas
  totalAmount: integer('total_amount').notNull(), // Em centavos, valor final
  customerName: text('customer_name'),
  customerEmail: text('customer_email'),
  customerDocument: text('customer_document'),
  customerPhone: text('customer_phone'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

export const orderBumps = pgTable('order_bumps', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(), // Em centavos
  isActive: boolean('is_active').default(true),
  imageUrl: text('image_url'),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// --- RELATIONS ---

export const usersRelations = relations(users, ({ one, many }) => ({
  subscription: one(subscriptions, {
    fields: [users.id],
    references: [subscriptions.userId],
  }),
  checkouts: many(checkouts),
}));

export const checkoutsRelations = relations(checkouts, ({ one }) => ({
  user: one(users, {
    fields: [checkouts.userId],
    references: [users.id],
  }),
  plan: one(plans, {
    fields: [checkouts.planId],
    references: [plans.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  plan: one(plans, {
    fields: [subscriptions.planId],
    references: [plans.id],
  }),
}));

export const whitelabelModelsRelations = relations(whitelabelModels, ({ many }) => ({
  posts: many(whitelabelPosts),
}));

export const whitelabelPostsRelations = relations(whitelabelPosts, ({ one, many }) => ({
  model: one(whitelabelModels, {
    fields: [whitelabelPosts.whitelabelModelId],
    references: [whitelabelModels.id],
  }),
  media: many(whitelabelMedia),
}));

export const whitelabelMediaRelations = relations(whitelabelMedia, ({ one }) => ({
  post: one(whitelabelPosts, {
    fields: [whitelabelMedia.whitelabelPostId],
    references: [whitelabelPosts.id],
  }),
}));

// --- ADS (ANÚNCIOS) ---

export const ads = pgTable('ads', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // Nome da campanha
  
  // Tipo de anúncio
  type: text('type', { 
    enum: ['diamond', 'diamond_block', 'banner', 'spot', 'hero'] 
  }).notNull().default('banner'),
  
  // Posicionamento/Placement
  placement: text('placement', {
    enum: ['home_top', 'home_middle', 'home_bottom', 'sidebar', 'feed_mix', 'models_grid', 'model_profile', 'login', 'register', 'feed_model', 'model_sidebar']
  }).notNull().default('home_top'),
  
  // Status do anúncio
  status: text('status', {
    enum: ['active', 'paused', 'draft']
  }).notNull().default('draft'),
  
  // Conteúdo do anúncio
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  ctaText: text('cta_text'),
  imageUrl: text('image_url'),
  link: text('link').notNull(),
  category: text('category'), // Para hero carousel
  
  // Estatísticas
  impressions: integer('impressions').default(0),
  clicks: integer('clicks').default(0),
  
  // Configurações de exibição
  priority: integer('priority').default(0), // Maior = maior prioridade
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

export const impressions = pgTable('impressions', {
  id: serial('id').primaryKey(),
  adId: integer('ad_id').references(() => ads.id, { onDelete: 'cascade' }).notNull(),
  placement: text('placement'),
  userAgent: text('user_agent'),
  ip: text('ip'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const clicks = pgTable('clicks', {
  id: serial('id').primaryKey(),
  adId: integer('ad_id').references(() => ads.id, { onDelete: 'cascade' }).notNull(),
  placement: text('placement'),
  userAgent: text('user_agent'),
  ip: text('ip'),
  createdAt: timestamp('created_at').defaultNow(),
});