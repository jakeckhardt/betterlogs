import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from './app/helpers/auth';
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
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

    return;
}

export const config = {
    matcher: ['/', '/login'],
}