import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from './app/helpers/auth';
 
export async function middleware(request: NextRequest) {
    // Initialize response headers
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    headers.set('Access-Control-Allow-Credentials', 'true');

    if (request.method === 'OPTIONS') {
        const response = new NextResponse(null, {
        status: 200,  // OK for preflight
        headers: headers,
        });
        return response;
    };



    if (request.nextUrl.pathname.startsWith("/api")) {
        if (request.nextUrl.pathname.startsWith('/api/login') || request.nextUrl.pathname.startsWith('/api/add-user')) {
            return;
        };

        const auth = request.headers.get('Authorization');
        const decoded = await verifyAuth(auth!);

        if (!decoded) {
            return NextResponse.json({message: 'No auth'}, {status: 500});
        }

        return;

    } else {
        const session = request.cookies.get("session");
        const verifiedToken = session && (await verifyAuth(session.value).catch((err) => {
            console.log(err)
        }));

        console.log(verifiedToken);
    
        if (!verifiedToken && request.nextUrl.pathname.startsWith('/login')) {
            return;
        };
    
        if (verifiedToken && request.nextUrl.pathname.startsWith('/login')) {
            return NextResponse.redirect(new URL('/', request.url))
        };
    
        if (!verifiedToken) {
            return NextResponse.redirect(new URL('/login', request.url))
        };
    }

    console.log("Auth completed and confirmed");

    return;
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