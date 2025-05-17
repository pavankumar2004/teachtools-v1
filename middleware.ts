import { boho } from "@/lib/boho";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Always allow access to metadata API
  if (request.nextUrl.pathname.startsWith('/api/metadata')) {
    return NextResponse.next();
  }
  
  // For all other requests, use boho middleware
  const response = boho.middleware(request);
  
  // If response is a redirect, check if it's an authentication redirect
  if (response instanceof NextResponse && response.status === 302) {
    const location = response.headers.get('location');
    if (location?.startsWith('/admin/login')) {
      // If it's an auth redirect, allow access instead
      return NextResponse.next();
    }
  }
  
  return response;
}
