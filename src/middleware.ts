import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from './app/helpers/auth';
 
export async function middleware(request: NextRequest) {

    if (request.nextUrl.pathname.startsWith("/api")) {

        if (request.nextUrl.pathname.startsWith('/api/login') || request.nextUrl.pathname.startsWith('/api/add-user')) {
            return;
        };

        const auth = request.headers.get('Authorization');
        const decoded = await verifyAuth(auth!);

        if (!decoded) {
            return NextResponse.json({message: 'No auth'}, {status: 500});
        }

        console.log("Api route", decoded);
        return;

    } else {
        const session = request.cookies.get("session");
     
        const verifiedToken = session && (await verifyAuth(session.value).catch((err) => {
            console.log(err)
        }));
    
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
