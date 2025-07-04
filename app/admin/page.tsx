import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { getAllCategories, getAllBookmarks, Category, Bookmark as BookmarkType } from "@/lib/data";
import { CategoryManager } from "@/components/admin/category-manager";
import { BookmarkManager } from "@/components/admin/bookmark-manager";
import { Section, Container } from "@/components/craft";
import { Bookmark as BookmarkIcon, FolderKanban, Settings2, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mark this page as dynamic to ensure it's rendered at request time in production
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Wrap database calls in try/catch to handle potential errors during build time
  let categories: Category[] = [];
  let bookmarks: (BookmarkType & { category: Category | null })[] = [];
  
  try {
    // Fetch data with proper error handling
    const categoriesPromise = getAllCategories().catch(err => {
      console.error('Error fetching categories:', err);
      return [];
    });
    
    const bookmarksPromise = getAllBookmarks().catch(err => {
      console.error('Error fetching bookmarks:', err);
      return [];
    });
    
    // Wait for both promises to resolve
    categories = await categoriesPromise;
    bookmarks = await bookmarksPromise;
    
    // Ensure data is in array format
    if (!Array.isArray(categories)) {
      console.error('Categories is not an array:', categories);
      categories = [];
    }
    
    if (!Array.isArray(bookmarks)) {
      console.error('Bookmarks is not an array:', bookmarks);
      bookmarks = [];
    }
  } catch (error) {
    console.error('Error fetching data for admin page:', error);
    // Fallback data for build time
    categories = [];
    bookmarks = [];
  }

  return (
    <Section>
      <Container>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-8">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your bookmarks and categories
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Card className="flex items-center gap-3 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <BookmarkIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {bookmarks.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Bookmarks</p>
                </div>
              </Card>
              <Card className="flex items-center gap-3 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <FolderKanban className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {categories.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
              </Card>
              <Link href="/admin/subscribers">
                <Card className="flex items-center gap-3 p-3 hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">Manage</p>
                    <p className="text-sm text-muted-foreground">Subscribers</p>
                  </div>
                </Card>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="bookmarks" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger value="bookmarks" className="gap-2">
                  <BookmarkIcon className="h-4 w-4" />
                  Bookmarks
                </TabsTrigger>
                <TabsTrigger value="categories" className="gap-2">
                  <FolderKanban className="h-4 w-4" />
                  Categories
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Card className="flex items-center gap-2 p-2">
                  <Settings2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Admin Controls
                  </span>
                </Card>
                <form action="/api/admin/logout">
                  <Button
                    type="submit"
                    variant="outline"
                    className="rounded-xl text-muted-foreground"
                  >
                    Sign Out
                  </Button>
                </form>
              </div>
            </div>

            <TabsContent value="bookmarks" className="space-y-4">
              <div className="rounded-xl border bg-card">
                <div className="border-b bg-muted/50 p-4">
                  <h2 className="text-lg font-semibold">Bookmark Management</h2>
                  <p className="text-sm text-muted-foreground">
                    Add, edit, and manage your bookmarks collection
                  </p>
                </div>
                <div className="p-6">
                  <BookmarkManager
                    bookmarks={bookmarks}
                    categories={categories}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <div className="rounded-xl border bg-card">
                <div className="border-b bg-muted/50 p-4">
                  <h2 className="text-lg font-semibold">Category Management</h2>
                  <p className="text-sm text-muted-foreground">
                    Organize and structure your bookmark categories
                  </p>
                </div>
                <div className="p-6">
                  <CategoryManager categories={categories} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </Section>
  );
}
