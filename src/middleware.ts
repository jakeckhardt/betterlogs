import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    console.log("Middleware triggered");

    // Allow all API routes to pass through
    if (request.nextUrl.pathname.startsWith("/api")) {
        console.log("API route hit, passing through to handler");
        return NextResponse.next();
    }

    // Allow non-API routes to continue
    console.log("Non-API route hit");
    return NextResponse.next();
}

export const config = {
    matcher: ['/api/:path*', '/', '/login', '/createboard', '/board/:path*'],
};
