import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Categories table
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  color: text("color"), // For UI customization
  icon: text("icon"), // For UI customization
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});

// Bookmarks table
export const bookmarks = pgTable("bookmarks", {
  // Core fields
  id: serial("id").primaryKey(),
  url: text("url").notNull().unique(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),

  // Organization
  categoryId: text("category_id").references(() => categories.id),
  tags: text("tags"), // Comma-separated tags

  // Metadata
  favicon: text("favicon"), // URL to the site's favicon
  screenshot: text("screenshot"), // URL to a screenshot of the page
  overview: text("overview"), // Short preview of the content

  // SEO and sharing
  ogImage: text("og_image"), // Open Graph image URL
  ogTitle: text("og_title"), // Open Graph title
  ogDescription: text("og_description"), // Open Graph description

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastVisited: timestamp("last_visited"),

  // User data
  notes: text("notes"), // Personal notes about the bookmark
  isArchived: boolean("is_archived").default(false).notNull(),
  isFavorite: boolean("is_favorite").default(false).notNull(),
  search_results: text("search_results"),
});

// Subscribers table
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  source: text("source"),
  userGroup: text("user_group"),
  isVerified: boolean("is_verified").default(false).notNull(),
  verificationToken: text("verification_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  category: one(categories, {
    fields: [bookmarks.categoryId],
    references: [categories.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  bookmarks: many(bookmarks),
}));

// Type definitions
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;
