import { NextResponse } from "next/server";
import { db, getDb } from "@/db/client";
import { bookmarks } from "@/db/schema";
import { parse } from 'csv-parse/sync';

interface CsvRecord {
  url: string;
  title: string;
  description?: string;
  category_id?: string;
  overview?: string;
  is_favorite: string;
  is_archived: string;
  slug: string;
  tags?: string;
}

interface BookmarkRecord {
  url: string;
  title: string;
  description: string | null;
  categoryId: string | null;
  overview: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  slug: string;
  tags: string[] | null;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Read and parse CSV
    const text = await file.text();
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true
    });

    // Validate and process records
    const processedRecords = records.map((record: CsvRecord): BookmarkRecord => ({
      url: record.url,
      title: record.title,
      description: record.description || null,
      categoryId: record.category_id || null,
      overview: record.overview || null,
      isFavorite: record.is_favorite === 'true',
      isArchived: record.is_archived === 'true',
      slug: record.slug,
      tags: record.tags ? record.tags.split(',') : null
    }));

    // Insert bookmarks
    await db.transaction(async (tx: typeof db) => {
      for (const record of processedRecords) {
        await tx.insert(bookmarks).values(record);
      }
    });

    return NextResponse.json(
      { message: "Bookmarks uploaded successfully", count: processedRecords.length },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing bulk upload:", error);
    return NextResponse.json(
      { error: "Failed to process bulk upload" },
      { status: 500 }
    );
  }
}
