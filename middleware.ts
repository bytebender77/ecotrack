import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';

const protectedRoutes = ['/dashboard', '/calculator', '/activities', '/challenges', '/leaderboard', '/map', '/profile'];
const authRoutes = ['/login', '/register'];

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const { pathname } = req.nextUrl;

    // Verify token
    let user = null;
    if (token) {
        user = await verifyJWT(token);
    }

    // If user is accessing a protected route and not logged in
    if (protectedRoutes.some(route => pathname.startsWith(route)) && !user) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // If user is accessing auth routes and IS logged in
    if (authRoutes.some(route => pathname.startsWith(route)) && user) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
