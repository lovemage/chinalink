import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ---------------------------------------------------------------------------
// admins
// ---------------------------------------------------------------------------
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  username: text('username').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// ---------------------------------------------------------------------------
// media
// ---------------------------------------------------------------------------
export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  filename: text('filename').notNull(),
  alt: text('alt'),
  mimeType: text('mime_type'),
  filesize: integer('filesize'),
  width: integer('width'),
  height: integer('height'),
  url: text('url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  cardUrl: text('card_url'),
  heroUrl: text('hero_url'),
  createdAt: timestamp('created_at').defaultNow(),
})

// ---------------------------------------------------------------------------
// categories (blog)
// ---------------------------------------------------------------------------
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// ---------------------------------------------------------------------------
// serviceCategories
// ---------------------------------------------------------------------------
export const serviceCategories = pgTable('service_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// ---------------------------------------------------------------------------
// productCategories
// ---------------------------------------------------------------------------
export const productCategories = pgTable('product_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// ---------------------------------------------------------------------------
// productTags
// ---------------------------------------------------------------------------
export const productTags = pgTable('product_tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// ---------------------------------------------------------------------------
// services
// ---------------------------------------------------------------------------
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  serviceCategoryId: integer('service_category_id').references(
    () => serviceCategories.id,
    { onDelete: 'set null' }
  ),
  iconName: text('icon_name').notNull().default('handshake'),
  coverImageId: integer('cover_image_id').references(() => media.id, {
    onDelete: 'set null',
  }),
  description: jsonb('description'),
  status: text('status').notNull().default('draft'),
  visibility: text('visibility').notNull().default('public'),
  pricingMode: text('pricing_mode').notNull().default('fixed'),
  price: integer('price'),
  basePrice: integer('base_price'),
  cartEnabled: boolean('cart_enabled').default(true),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ---------------------------------------------------------------------------
// serviceAddons
// ---------------------------------------------------------------------------
export const serviceAddons = pgTable('service_addons', {
  id: serial('id').primaryKey(),
  serviceId: integer('service_id')
    .references(() => services.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  required: boolean('required').default(false),
  sortOrder: integer('sort_order').default(0),
})

// ---------------------------------------------------------------------------
// serviceFeatures
// ---------------------------------------------------------------------------
export const serviceFeatures = pgTable('service_features', {
  id: serial('id').primaryKey(),
  serviceId: integer('service_id')
    .references(() => services.id, { onDelete: 'cascade' })
    .notNull(),
  text: text('text').notNull(),
  sortOrder: integer('sort_order').default(0),
})

// ---------------------------------------------------------------------------
// products
// ---------------------------------------------------------------------------
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  productCategoryId: integer('product_category_id').references(
    () => productCategories.id,
    { onDelete: 'set null' }
  ),
  coverImageId: integer('cover_image_id').references(() => media.id, {
    onDelete: 'set null',
  }),
  summary: text('summary'),
  description: jsonb('description'),
  status: text('status').notNull().default('draft'),
  visibility: text('visibility').notNull().default('public'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ---------------------------------------------------------------------------
// productImages
// ---------------------------------------------------------------------------
export const productImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  mediaId: integer('media_id')
    .references(() => media.id, { onDelete: 'cascade' })
    .notNull(),
  sortOrder: integer('sort_order').default(0),
})

// ---------------------------------------------------------------------------
// productVariants
// ---------------------------------------------------------------------------
export const productVariants = pgTable('product_variants', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  sku: text('sku').notNull(),
  name: text('name').notNull(),
  specs: jsonb('specs'),
  price: integer('price').notNull(),
  compareAtPrice: integer('compare_at_price'),
  stock: integer('stock').notNull().default(0),
  isDefault: boolean('is_default').default(false),
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
})

// ---------------------------------------------------------------------------
// productFeatures
// ---------------------------------------------------------------------------
export const productFeatures = pgTable('product_features', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  text: text('text').notNull(),
  sortOrder: integer('sort_order').default(0),
})

// ---------------------------------------------------------------------------
// productTagRelations (composite PK junction table)
// ---------------------------------------------------------------------------
export const productTagRelations = pgTable(
  'product_tag_relations',
  {
    productId: integer('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    tagId: integer('tag_id')
      .references(() => productTags.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.productId, table.tagId] })]
)

// ---------------------------------------------------------------------------
// posts
// ---------------------------------------------------------------------------
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  categoryId: integer('category_id').references(() => categories.id, {
    onDelete: 'set null',
  }),
  coverImageId: integer('cover_image_id').references(() => media.id, {
    onDelete: 'set null',
  }),
  excerpt: text('excerpt'),
  author: text('author').default('懂陸姐'),
  status: text('status').notNull().default('draft'),
  publishedAt: timestamp('published_at'),
  content: jsonb('content'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ---------------------------------------------------------------------------
// customers
// ---------------------------------------------------------------------------
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  phone: text('phone'),
  avatar: text('avatar'),
  authProvider: text('auth_provider').notNull(),
  providerId: text('provider_id').notNull(),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ---------------------------------------------------------------------------
// orders
// ---------------------------------------------------------------------------
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: text('order_number').unique().notNull(),
  itemType: text('item_type').notNull().default('service'),
  customerId: integer('customer_id').references(() => customers.id, {
    onDelete: 'set null',
  }),
  serviceId: integer('service_id').references(() => services.id, {
    onDelete: 'set null',
  }),
  productId: integer('product_id').references(() => products.id, {
    onDelete: 'set null',
  }),
  productVariantSKU: text('product_variant_sku'),
  productVariantName: text('product_variant_name'),
  amount: integer('amount').notNull(),
  paymentMethod: text('payment_method'),
  paymentStatus: text('payment_status').notNull().default('pending'),
  orderStatus: text('order_status').notNull().default('pending'),
  ecpayTradeNo: text('ecpay_trade_no'),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ---------------------------------------------------------------------------
// orderItems
// ---------------------------------------------------------------------------
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  itemType: text('item_type').notNull().default('service'),
  serviceId: integer('service_id').references(() => services.id, {
    onDelete: 'set null',
  }),
  serviceName: text('service_name'),
  productId: integer('product_id').references(() => products.id, {
    onDelete: 'set null',
  }),
  productName: text('product_name'),
  variantSKU: text('variant_sku'),
  variantName: text('variant_name'),
  unitPrice: integer('unit_price').notNull(),
  quantity: integer('quantity').notNull(),
  subtotal: integer('subtotal').notNull(),
})

// ---------------------------------------------------------------------------
// orderSelectedAddons
// ---------------------------------------------------------------------------
export const orderSelectedAddons = pgTable('order_selected_addons', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  price: integer('price').notNull(),
})

// ---------------------------------------------------------------------------
// inquiries
// ---------------------------------------------------------------------------
export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  itemType: text('item_type').default('service'),
  customerId: integer('customer_id').references(() => customers.id, {
    onDelete: 'set null',
  }),
  serviceId: integer('service_id').references(() => services.id, {
    onDelete: 'set null',
  }),
  productId: integer('product_id').references(() => products.id, {
    onDelete: 'set null',
  }),
  name: text('name').notNull(),
  contactMethod: text('contact_method').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ---------------------------------------------------------------------------
// inquiryAttachments
// ---------------------------------------------------------------------------
export const inquiryAttachments = pgTable('inquiry_attachments', {
  id: serial('id').primaryKey(),
  inquiryId: integer('inquiry_id')
    .references(() => inquiries.id, { onDelete: 'cascade' })
    .notNull(),
  mediaId: integer('media_id')
    .references(() => media.id, { onDelete: 'cascade' })
    .notNull(),
})

// ---------------------------------------------------------------------------
// siteSettings
// ---------------------------------------------------------------------------
export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  value: text('value'),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ---------------------------------------------------------------------------
// emailTemplates
// ---------------------------------------------------------------------------
export const emailTemplates = pgTable('email_templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  subject: text('subject').notNull(),
  type: text('type').notNull().default('system'),
  status: text('status').notNull().default('active'),
  availableVariables: jsonb('available_variables'),
  content: jsonb('content'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ---------------------------------------------------------------------------
// verificationCodes
// ---------------------------------------------------------------------------
export const verificationCodes = pgTable('verification_codes', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  code: text('code').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const serviceCategoriesRelations = relations(
  serviceCategories,
  ({ many }) => ({
    services: many(services),
  })
)

export const servicesRelations = relations(services, ({ one, many }) => ({
  serviceCategory: one(serviceCategories, {
    fields: [services.serviceCategoryId],
    references: [serviceCategories.id],
  }),
  coverImage: one(media, {
    fields: [services.coverImageId],
    references: [media.id],
  }),
  addons: many(serviceAddons),
  features: many(serviceFeatures),
  orders: many(orders),
  inquiries: many(inquiries),
}))

export const serviceAddonsRelations = relations(serviceAddons, ({ one }) => ({
  service: one(services, {
    fields: [serviceAddons.serviceId],
    references: [services.id],
  }),
}))

export const serviceFeaturesRelations = relations(
  serviceFeatures,
  ({ one }) => ({
    service: one(services, {
      fields: [serviceFeatures.serviceId],
      references: [services.id],
    }),
  })
)

export const productCategoriesRelations = relations(
  productCategories,
  ({ many }) => ({
    products: many(products),
  })
)

export const productTagsRelations = relations(productTags, ({ many }) => ({
  tagRelations: many(productTagRelations),
}))

export const productsRelations = relations(products, ({ one, many }) => ({
  productCategory: one(productCategories, {
    fields: [products.productCategoryId],
    references: [productCategories.id],
  }),
  coverImage: one(media, {
    fields: [products.coverImageId],
    references: [media.id],
  }),
  images: many(productImages),
  variants: many(productVariants),
  features: many(productFeatures),
  tagRelations: many(productTagRelations),
  orders: many(orders),
  inquiries: many(inquiries),
}))

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
  media: one(media, {
    fields: [productImages.mediaId],
    references: [media.id],
  }),
}))

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  })
)

export const productFeaturesRelations = relations(
  productFeatures,
  ({ one }) => ({
    product: one(products, {
      fields: [productFeatures.productId],
      references: [products.id],
    }),
  })
)

export const productTagRelationsRelations = relations(
  productTagRelations,
  ({ one }) => ({
    product: one(products, {
      fields: [productTagRelations.productId],
      references: [products.id],
    }),
    tag: one(productTags, {
      fields: [productTagRelations.tagId],
      references: [productTags.id],
    }),
  })
)

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  coverImage: one(media, {
    fields: [posts.coverImageId],
    references: [media.id],
  }),
}))

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
  inquiries: many(inquiries),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  service: one(services, {
    fields: [orders.serviceId],
    references: [services.id],
  }),
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
  }),
  items: many(orderItems),
  selectedAddons: many(orderSelectedAddons),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  service: one(services, {
    fields: [orderItems.serviceId],
    references: [services.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))

export const orderSelectedAddonsRelations = relations(
  orderSelectedAddons,
  ({ one }) => ({
    order: one(orders, {
      fields: [orderSelectedAddons.orderId],
      references: [orders.id],
    }),
  })
)

export const inquiriesRelations = relations(inquiries, ({ one, many }) => ({
  customer: one(customers, {
    fields: [inquiries.customerId],
    references: [customers.id],
  }),
  service: one(services, {
    fields: [inquiries.serviceId],
    references: [services.id],
  }),
  product: one(products, {
    fields: [inquiries.productId],
    references: [products.id],
  }),
  attachments: many(inquiryAttachments),
}))

export const inquiryAttachmentsRelations = relations(
  inquiryAttachments,
  ({ one }) => ({
    inquiry: one(inquiries, {
      fields: [inquiryAttachments.inquiryId],
      references: [inquiries.id],
    }),
    media: one(media, {
      fields: [inquiryAttachments.mediaId],
      references: [media.id],
    }),
  })
)
