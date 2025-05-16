"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  createBookmark,
  updateBookmark,
  deleteBookmark,
  generateContent,
  bulkUploadBookmarks,
  type ActionState,
} from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Upload, Loader2, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

interface Bookmark {
  id: number;
  title: string;
  slug: string;
  url: string;
  description: string | null;
  overview: string | null;
  search_results: string | null;
  favicon: string | null;
  ogImage: string | null;
  categoryId: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  notes: string | null;
}

interface BookmarkWithCategory extends Bookmark {
  category: Category | null;
}

interface BookmarkManagerProps {
  categories: Category[];
  bookmarks: BookmarkWithCategory[];
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function BookmarkManager({
  bookmarks,
  categories,
}: BookmarkManagerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isBulkSheetOpen, setIsBulkSheetOpen] = useState(false);

  const [bulkUploadState, setBulkUploadState] = useState<ActionState | null>(
    null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [bulkUploadCategory, setBulkUploadCategory] = useState<string>("none");
  const [urlInputMode, setUrlInputMode] = useState<"file" | "text">("file");
  const [directUrlInput, setDirectUrlInput] = useState<string>("");

  const [bookmarkToDelete, setBookmarkToDelete] =
    useState<BookmarkWithCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedBookmark, setSelectedBookmark] =
    useState<BookmarkWithCategory | null>(null);
  const [isNewBookmark, setIsNewBookmark] = useState(true);

  useEffect(() => {
    if (bulkUploadState?.success) {
      console.log("Bulk upload state updated (success):", bulkUploadState);
      if (
        bulkUploadState.progress?.current === bulkUploadState.progress?.total
      ) {
        toast.success(
          bulkUploadState.message || "Bookmarks uploaded successfully",
        );
        setIsUploading(false);
        setIsSheetOpen(false);
        setBulkUploadState(null);
      } else if (bulkUploadState.progress?.lastAdded) {
        toast.success(`Added: ${bulkUploadState.progress.lastAdded}`);
      }
    } else if (bulkUploadState?.error) {
      console.log("Bulk upload state updated (error):", bulkUploadState);
      toast.error(bulkUploadState.error);
      if (
        !bulkUploadState.progress ||
        bulkUploadState.progress.current === bulkUploadState.progress.total
      ) {
        setIsUploading(false);
      }
    }
  }, [bulkUploadState]);

  // Form state management
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    url: "",
    description: "",
    overview: "",
    search_results: "",
    favicon: "",
    ogImage: "",
    categoryId: "none",
    isFavorite: false,
    isArchived: false,
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData(e.currentTarget);
      const formDataObject = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        url: formData.get("url") as string,
        slug: formData.get("slug") as string,
        overview: formData.get("overview") as string,
        favicon: formData.get("favicon") as string,
        ogImage: formData.get("ogImage") as string,
        search_results: formData.get("search_results") as string,
        categoryId: formData.get("categoryId") as string,
        isFavorite: formData.get("isFavorite") as string,
        isArchived: formData.get("isArchived") as string,
      };

      if (!isNewBookmark) {
        (formDataObject as any).id = formData.get("id") as string;
      }

      const result = isNewBookmark
        ? await createBookmark(null, formDataObject)
        : await updateBookmark(null, formDataObject as any);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          isNewBookmark ? "Bookmark created!" : "Bookmark updated!",
        );
        setIsSheetOpen(false);
        resetForm();
      }
    } catch (err) {
      console.error("Error saving bookmark:", err);
      toast.error("Failed to save bookmark");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset form when sheet opens/closes
  useEffect(() => {
    if (isSheetOpen) {
      if (selectedBookmark) {
        setFormData({
          title: selectedBookmark.title,
          slug: selectedBookmark.slug,
          url: selectedBookmark.url,
          description: selectedBookmark.description || "",
          overview: selectedBookmark.overview || "",
          search_results: selectedBookmark.search_results || "",
          favicon: selectedBookmark.favicon || "",
          ogImage: selectedBookmark.ogImage || "",
          categoryId: selectedBookmark.categoryId?.toString() || "none",
          isFavorite: selectedBookmark.isFavorite,
          isArchived: selectedBookmark.isArchived,
        });
      } else {
        resetForm();
      }
    }
  }, [isSheetOpen, selectedBookmark]);

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      url: "",
      description: "",
      overview: "",
      search_results: "",
      favicon: "",
      ogImage: "",
      categoryId: "none",
      isFavorite: false,
      isArchived: false,
    });
  };

  const handleEdit = (bookmark: BookmarkWithCategory) => {
    setSelectedBookmark(bookmark);
    setIsNewBookmark(false);
    setIsSheetOpen(true);
  };

  const handleNew = () => {
    setSelectedBookmark(null);
    setIsNewBookmark(true);
    setIsSheetOpen(true);
  };

  const handleDelete = async (bookmark: BookmarkWithCategory) => {
    setIsDeleting(true);
    setBookmarkToDelete(bookmark);

    try {
      const deleteData = {
        id: bookmark.id.toString(),
        url: bookmark.url,
      };
      const result = await deleteBookmark(null, deleteData);

      if (result.success) {
        toast.success("Bookmark deleted!");
        setBookmarkToDelete(null);
      } else {
        toast.error(result.error || "Failed to delete bookmark");
      }
    } catch (err) {
      console.error("Error deleting bookmark:", err);
      toast.error("Failed to delete bookmark");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    setFormData((prev) => ({ ...prev, title, slug }));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let url = e.target.value.trim();
    if (url && !url.match(/^https?:\/\//)) {
      url = `https://${url}`;
    }
    setFormData((prev) => ({ ...prev, url }));
  };

  const handleGenerateContent = async (form: HTMLFormElement) => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      const formData = new FormData(form);
      const url = formData.get("url") as string;

      if (!url) {
        toast.error("Please enter a URL first");
        return;
      }

      // Create a new FormData with just the URL
      const data = new FormData();
      data.append("url", url);

      const result = await generateContent(url);

      if ("error" in result) {
        toast.error(result.error as string);
      } else {
        setFormData((prev) => ({
          ...prev,
          title: result.title || prev.title,
          description: result.description || prev.description,
          overview: result.overview || prev.overview,
          favicon: result.favicon || prev.favicon,
          ogImage: result.ogImage || prev.ogImage,
          slug: result.slug || prev.slug,
        }));
        toast.success("Content generated successfully!");
      }
    } catch (err) {
      console.error("Error generating content:", err);
      toast.error("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBulkUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Bulk upload form submitted");
    
    const formData = new FormData(e.currentTarget);
    const categoryId = formData.get("categoryId") as string;
    console.log("Category ID from form:", categoryId);
    
    let urlsText = "";
    
    // Get URLs either from file or direct input
    if (urlInputMode === "file") {
      console.log("URL input mode: file upload");
      const file = formData.get("file") as File;
      if (!file) {
        console.log("No file selected");
        toast.error("Please select a file to upload");
        return;
      }
      
      try {
        console.log("File received:", {
          name: file.name,
          type: file.type,
          size: file.size
        });
        
        urlsText = await file.text();
        console.log(`File text read, length: ${urlsText.length} characters`);
      } catch (error) {
        console.error("Error reading file:", error);
        toast.error("Error reading the uploaded file");
        return;
      }
    } else {
      // Using direct text input
      console.log("URL input mode: direct text input");
      urlsText = directUrlInput;
      console.log(`Direct input text, length: ${urlsText.length} characters`);
      
      if (!urlsText.trim()) {
        console.log("No text entered in direct input");
        toast.error("Please enter at least one URL");
        return;
      }
    }

    try {
      console.log("Starting bulk upload process");
      setIsUploading(true);
      
      if (!urlsText.trim()) {
        console.log("No content found to process after trimming");
        toast.error("No content found to process");
        setIsUploading(false);
        return;
      }
      
      const urls = urlsText
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url && !url.toLowerCase().startsWith("url")); // Skip header if present
      
      console.log(`Parsed ${urls.length} URLs from input:`, urls);

      if (urls.length === 0) {
        console.log("No valid URLs found after parsing");
        toast.error("No valid URLs found");
        setIsUploading(false);
        return;
      }

      toast.info(`Processing ${urls.length} URLs. This may take a while...`);
      
      // Prepare the data for the server action
      const urlsString = urls.join("\n");
      console.log(`Sending ${urls.length} URLs to server with category: ${categoryId}`);
      
      console.log("Calling bulkUploadBookmarks server action");
      const result = await bulkUploadBookmarks(null, { 
        urls: urlsString,
        categoryId: categoryId 
      });
      console.log("Server action completed with result:", result);
      
      setBulkUploadState(result);
      console.log("Updated bulkUploadState with result");

      if (result.success) {
        console.log("Bulk upload successful:", result.message);
        toast.success(result.message || "Bookmarks uploaded successfully");
        setIsBulkSheetOpen(false);
        setDirectUrlInput("");
      } else {
        console.log("Bulk upload failed:", result.error);
        toast.error(result.error || "Failed to upload bookmarks");
      }
      
      setIsUploading(false);
      console.log("Bulk upload process complete");
    } catch (error) {
      console.error("Bulk upload error:", error);
      toast.error("Failed to process URLs");
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Manage Bookmarks</h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsBulkSheetOpen(true)}
            size="sm"
            variant="outline"
          >
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button onClick={handleNew} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Bookmark
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookmarks.map((bookmark) => (
              <TableRow key={bookmark.id}>
                <TableCell className="font-medium">{bookmark.title}</TableCell>
                <TableCell>
                  {bookmark.category && (
                    <Badge
                      style={{
                        backgroundColor: bookmark.category.color || undefined,
                        color: "white",
                      }}
                    >
                      {bookmark.category.name}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {bookmark.isFavorite && (
                      <Badge variant="secondary">Favorite</Badge>
                    )}
                    {bookmark.isArchived && (
                      <Badge variant="secondary">Archived</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(bookmark)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(bookmark)}
                      disabled={
                        isDeleting && bookmarkToDelete?.id === bookmark.id
                      }
                    >
                      {isDeleting && bookmarkToDelete?.id === bookmark.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>
              {isNewBookmark ? "Add Bookmark" : "Edit Bookmark"}
            </SheetTitle>
            <SheetDescription>
              {isNewBookmark
                ? "Add a new bookmark to your collection"
                : "Update the details of your bookmark"}
            </SheetDescription>
          </SheetHeader>

          <form
            id="bookmarkForm"
            onSubmit={handleSubmit}
            className="mt-6 space-y-6"
          >
            <input type="hidden" name="id" value={selectedBookmark?.id || ""} />
            <input type="hidden" name="slug" value={formData.slug} />

            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="url"
                      name="url"
                      type="url"
                      required
                      value={formData.url}
                      onChange={handleUrlChange}
                      placeholder="https://example.com"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        const form = document.getElementById(
                          "bookmarkForm",
                        ) as HTMLFormElement;
                        if (form) handleGenerateContent(form);
                      }}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate"
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overview">Overview</Label>
                  <Textarea
                    id="overview"
                    name="overview"
                    value={formData.overview}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        overview: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    name="categoryId"
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, categoryId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Category</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input
                    id="favicon"
                    name="favicon"
                    type="url"
                    value={formData.favicon}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        favicon: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ogImage">OG Image URL</Label>
                  <Input
                    id="ogImage"
                    name="ogImage"
                    type="url"
                    value={formData.ogImage}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ogImage: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isFavorite"
                      name="isFavorite"
                      checked={formData.isFavorite}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isFavorite: checked as boolean,
                        }))
                      }
                    />
                    <Label htmlFor="isFavorite">Favorite</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isArchived"
                      name="isArchived"
                      checked={formData.isArchived}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isArchived: checked as boolean,
                        }))
                      }
                    />
                    <Label htmlFor="isArchived">Archived</Label>
                  </div>
                </div>
              </div>
            </div>

            <SheetFooter>
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
                <SheetClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </SheetClose>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <Sheet open={isBulkSheetOpen} onOpenChange={setIsBulkSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Bulk Upload Bookmarks</SheetTitle>
            <SheetDescription>
              Import multiple URLs at once by uploading a file or entering them directly.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleBulkUpload} className="mt-6 space-y-6">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant={urlInputMode === "file" ? "default" : "outline"}
                  onClick={() => setUrlInputMode("file")}
                  size="sm"
                >
                  Upload File
                </Button>
                <Button 
                  type="button" 
                  variant={urlInputMode === "text" ? "default" : "outline"}
                  onClick={() => setUrlInputMode("text")}
                  size="sm"
                >
                  Enter URLs
                </Button>
              </div>
              
              {urlInputMode === "file" ? (
                <div className="space-y-2">
                  <Label htmlFor="file">Upload CSV or Text File</Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept=".csv,text/csv,.txt,text/plain"
                    required
                    disabled={isUploading}
                  />
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      Upload a CSV or text file with a list of URLs (one per line). The
                      first row can optionally contain a header.
                    </p>
                    <p className="font-medium">File format example:</p>
                    <pre className="bg-muted p-2 rounded-md text-xs">
                      url<br/>
                      https://example.com<br/>
                      https://anothersite.com<br/>
                      https://third-example.org
                    </pre>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const csvContent = "url\nhttps://example.com\nhttps://anothersite.com";
                        const blob = new Blob([csvContent], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'bookmark-template.csv';
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Download Sample Template
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="directUrls">Enter URLs</Label>
                  <Textarea
                    id="directUrls"
                    value={directUrlInput}
                    onChange={(e) => setDirectUrlInput(e.target.value)}
                    placeholder="https://example.com&#10;https://anothersite.com&#10;https://third-example.org"
                    rows={10}
                    disabled={isUploading}
                    className="font-mono text-sm"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter one URL per line. You can paste multiple links directly from your browser.
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="bulkCategoryId">Category (Optional)</Label>
                <Select
                  name="categoryId"
                  value={bulkUploadCategory}
                  onValueChange={(value) => setBulkUploadCategory(value)}
                  disabled={isUploading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Category</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Assign all imported bookmarks to this category. If not selected, bookmarks will have no category.
                </p>
              </div>

              {isUploading && (
                <div className="space-y-2 rounded-md bg-muted p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">
                      Processing URLs...
                    </span>
                  </div>
                  {bulkUploadState?.progress && (
                    <div className="text-sm text-muted-foreground">
                      Processing {bulkUploadState.progress.current} of{" "}
                      {bulkUploadState.progress.total} URLs
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    This may take a while. Please keep this window open.
                  </p>
                </div>
              )}
              
              {bulkUploadState?.data?.errors && bulkUploadState.data.errors.length > 0 && (
                <div className="space-y-2 rounded-md bg-destructive/10 p-4">
                  <p className="text-sm font-medium text-destructive">Errors occurred:</p>
                  <div className="max-h-40 overflow-y-auto text-xs">
                    <ul className="list-disc pl-5 space-y-1">
                      {(bulkUploadState.data.errors as string[]).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <SheetFooter>
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                </SheetClose>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload and Process"
                  )}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
