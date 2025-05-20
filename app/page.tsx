// React + Next Imports
import React from "react";
import { Suspense } from "react";

// Database Imports
import { getAllBookmarks, getAllCategories, Bookmark, Category } from "@/lib/data";

// Component Imports
import { Main, Section, Container } from "@/components/craft";
import { BookmarkCard } from "@/components/bookmark-card";
import { BookmarkGrid } from "@/components/bookmark-grid";
import { CategoryFilter } from "@/components/category-filter";
import { EmailForm } from "@/components/email-form";

import Balancer from "react-wrap-balancer";

// Use Incremental Static Regeneration with a 1-hour revalidation period
// This significantly improves page performance while keeping content fresh
export const revalidate = 3600; // Revalidate every hour

export default async function Home({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  // Wrap database calls in try/catch to handle potential errors during build time
  let bookmarks: (Bookmark & { category: Category | null })[] = [];
  let categories: Category[] = [];
  let error = null;
  
  try {
    // Use Promise.all to fetch data in parallel with proper caching
    // This reduces waterfall requests and improves performance
    [bookmarks, categories] = await Promise.all([
      getAllBookmarks().catch(err => {
        console.error('Error fetching bookmarks:', err);
        return [];
      }),
      getAllCategories().catch(err => {
        console.error('Error fetching categories:', err);
        return [];
      })
    ]);
    
    // Ensure bookmarks and categories are arrays
    if (!Array.isArray(bookmarks)) {
      console.error('Bookmarks is not an array:', bookmarks);
      bookmarks = [];
    }
    
    if (!Array.isArray(categories)) {
      console.error('Categories is not an array:', categories);
      categories = [];
    }
  } catch (err) {
    console.error('Error fetching data:', err);
    error = err;
    // Provide fallback data
    bookmarks = [];
    categories = [];
  }

  // Filter bookmarks based on category and search parameters
  const filteredBookmarks = Array.isArray(bookmarks) 
    ? bookmarks
      .filter(
        (bookmark: Bookmark & { category: Category | null }) =>
          !searchParams.category ||
          bookmark.category?.id.toString() === searchParams.category,
      )
      .filter((bookmark: Bookmark & { category: Category | null }) => {
        if (!searchParams.search) return true;
        const searchTerm = searchParams.search.toLowerCase();
        return (
          bookmark.title.toLowerCase().includes(searchTerm) ||
          bookmark.description?.toLowerCase().includes(searchTerm) ||
          bookmark.category?.name.toLowerCase().includes(searchTerm) ||
          bookmark.notes?.toLowerCase().includes(searchTerm) ||
          bookmark.overview?.toLowerCase().includes(searchTerm)
        );
      }) 
    : [];

  return (
    <Main>
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl space-y-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <Balancer>
                Top AI Tools for Modern Educators
              </Balancer>
            </h1>
            <p className="text-xl text-muted-foreground">
              <Balancer>
                Discover powerful AI solutions that revolutionize lesson planning, grading, 
                content creation, and classroom management for today's teachers.
              </Balancer>
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <EmailForm />
              <p className="text-sm text-muted-foreground">
                Join 5,000+ educators · Weekly updates · Unsubscribe anytime
              </p>
            </div>
          </div>

          <div className="mt-24 space-y-6">
            <Suspense fallback={<div>Loading categories...</div>}>
              <CategoryFilter
                categories={categories.map((cat) => ({
                  id: cat.id.toString(),
                  name: cat.name,
                  color: cat.color || undefined,
                  icon: cat.icon || undefined,
                }))}
              />
            </Suspense>

            <BookmarkGrid>
              {filteredBookmarks && filteredBookmarks.map((bookmark: Bookmark & { category: Category | null }) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={{
                    id: bookmark.id,
                    url: bookmark.url,
                    title: bookmark.title,
                    description: bookmark.description,
                    category: bookmark.category
                      ? {
                          id: bookmark.category.id.toString(),
                          name: bookmark.category.name,
                          color: bookmark.category.color || undefined,
                          icon: bookmark.category.icon || undefined,
                        }
                      : undefined,
                    favicon: bookmark.favicon,
                    overview: bookmark.overview,
                    ogImage: bookmark.ogImage,
                    isArchived: bookmark.isArchived,
                    isFavorite: bookmark.isFavorite,
                    slug: bookmark.slug,
                  }}
                />
              ))}
            </BookmarkGrid>

            {filteredBookmarks.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                No bookmarks found
                {searchParams.search && ` matching "${searchParams.search}"`}
                {searchParams.category &&
                  ` in category "${categories.find((c) => c.id.toString() === searchParams.category)?.name}"`}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </Main>
  );
}
