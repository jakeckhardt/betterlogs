import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from './app/helpers/auth';

export async function middleware(request: NextRequest) {
    // Handling API routes
    if (request.nextUrl.pathname.startsWith("/api")) {
        // Skip authentication for these API routes
        if (request.nextUrl.pathname.startsWith('/api/login') || request.nextUrl.pathname.startsWith('/api/add-user')) {
            return NextResponse.next();
        }

        // Get the Authorization header
        const auth = request.headers.get('Authorization');
        
        // Verify the auth token
        const decoded = await verifyAuth(auth!);

        // If authentication fails, return 401 Unauthorized
        if (!decoded) {
            return NextResponse.json({ message: 'No auth' }, { status: 401 });
        }

        // If authenticated, continue to the API route
        return NextResponse.next();
    }

    // Handling non-API routes
    else {
        // Get session cookie
        const session = request.cookies.get("session");

        // Verify session token
        const verifiedToken = session && (await verifyAuth(session.value).catch((err) => {
            console.log(err);
        }));

        // If not authenticated and accessing the login page, allow it
        if (!verifiedToken && request.nextUrl.pathname.startsWith('/login')) {
            return NextResponse.next();
        }

        // If authenticated and trying to access the login page, redirect to home
        if (verifiedToken && request.nextUrl.pathname.startsWith('/login')) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // If no valid session and not on login page, redirect to login
        if (!verifiedToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    console.log("Auth completed and confirmed");

    // Allow the request to proceed if authentication is successful
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/', 
        '/login', 
        '/createboard',
        '/board/:path*',
        '/api/:path*'
    ]
}
