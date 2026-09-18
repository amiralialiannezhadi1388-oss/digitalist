import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";

// 1. Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 50 }).notNull().default("user"), // 'admin' | 'user'
  phone: varchar("phone", { length: 50 }),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Site Settings
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }),
  category: varchar("category", { length: 100 }).notNull(), // 'computer' | 'components' | 'laptop' | 'monitor' | 'accessories' | 'gaming' | 'violin' | 'violin_accessories'
  categoryName: varchar("category_name", { length: 100 }).notNull(),
  price: integer("price").notNull(), // in Tomans
  originalPrice: integer("original_price"),
  discountPercent: integer("discount_percent").default(0),
  stock: integer("stock").notNull().default(5),
  image: text("image").notNull(),
  gallery: text("gallery"), // JSON array of strings
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  specs: text("specs"), // JSON string { [key: string]: string }
  tags: text("tags"), // JSON string string[]
  rating: numeric("rating", { precision: 2, scale: 1 }).default("5.0"),
  reviewCount: integer("review_count").default(0),
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. Courses
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  titleEn: varchar("title_en", { length: 255 }),
  category: varchar("category", { length: 100 }).notNull(), // 'photoshop' | 'premiere' | 'python' | 'violin'
  instructor: varchar("instructor", { length: 255 }).notNull().default("هکر امیر"),
  price: integer("price").notNull(), // in Tomans (no course initially free)
  originalPrice: integer("original_price"),
  discountPercent: integer("discount_percent").default(0),
  image: text("image").notNull(),
  previewVideoUrl: text("preview_video_url"),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  level: varchar("level", { length: 100 }).default("مقدماتی تا حرفه‌ای"),
  durationHours: integer("duration_hours").notNull().default(10),
  sessionsCount: integer("sessions_count").notNull().default(12),
  prerequisites: text("prerequisites"),
  rating: numeric("rating", { precision: 2, scale: 1 }).default("5.0"),
  reviewCount: integer("review_count").default(0),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 5. Course Sessions
export const courseSessions = pgTable("course_sessions", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  orderNum: integer("order_num").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  duration: varchar("duration", { length: 50 }).notNull(),
  videoUrl: text("video_url"),
  pdfUrl: text("pdf_url"),
  isFreePreview: boolean("is_free_preview").default(false),
  description: text("description"),
});

// 6. Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  userId: integer("user_id"),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  shippingAddress: text("shipping_address"),
  postalCode: varchar("postal_code", { length: 50 }),
  subtotal: integer("subtotal").notNull(),
  discount: integer("discount").default(0),
  shippingCost: integer("shipping_cost").default(0),
  totalPrice: integer("total_price").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("paid"), // 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled'
  paymentGateway: varchar("payment_gateway", { length: 100 }).default("zarinpal"),
  paymentTrackingCode: varchar("payment_tracking_code", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 7. Order Items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  itemType: varchar("item_type", { length: 50 }).notNull(), // 'product' | 'course'
  itemId: integer("item_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull().default(1),
  image: text("image"),
});

// 8. User Courses (Enrolled)
export const userCourses = pgTable("user_courses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  orderId: integer("order_id"),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
});

// 9. Reviews
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  itemType: varchar("item_type", { length: 50 }).notNull(), // 'product' | 'course'
  itemId: integer("item_id").notNull(),
  userId: integer("user_id"),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  rating: integer("rating").notNull().default(5),
  comment: text("comment").notNull(),
  isApproved: boolean("is_approved").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 10. Wishlist
export const wishlist = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  itemType: varchar("item_type", { length: 50 }).notNull(), // 'product' | 'course'
  itemId: integer("item_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 11. Game Scores
export const gameScores = pgTable("game_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  playerName: varchar("player_name", { length: 255 }).notNull(),
  score: integer("score").notNull(),
  levelReached: integer("level_reached").notNull().default(1),
  coinsCollected: integer("coins_collected").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 12. Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"), // null for system-wide broadcast
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  link: text("link"),
  type: varchar("type", { length: 50 }).default("info"), // 'info' | 'discount' | 'order' | 'course'
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 13. Contact Messages
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
