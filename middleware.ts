import { boho } from "@/lib/boho";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Allow metadata API access without authentication
  if (request.nextUrl.pathname.startsWith('/api/metadata')) {
    return NextResponse.next();
  }
  
  return boho.middleware(request);
}
