import { NextResponse } from "next/server";
import { db, getDb } from "@/db/client";
import { bookmarks } from "@/db/schema";
import { eq } from "drizzle-orm";

// Mark this route as dynamic to avoid static generation issues
export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request,
  { params }: { params: { url: string } },
) {
  try {
    const decodedUrl = decodeURIComponent(params.url);

    await db.delete(bookmarks).where(eq(bookmarks.url, decodedUrl));

    return NextResponse.json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 },
    );
  }
}
