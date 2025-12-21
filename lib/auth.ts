import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET || 'secret';
const key = new TextEncoder().encode(secretKey);

export async function signJWT(payload: any, expiresIn: string = '24h') { // Use 'any' intentionally for flexibility
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(key);
}

export async function verifyJWT(token: string) {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function getSession() {
    const token = cookies().get('token')?.value;
    if (!token) return null;
    return await verifyJWT(token);
}

export async function login(payload: any) {
    const token = await signJWT(payload);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    cookies().set('token', token, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });

    return token;
}

export async function logout() {
    cookies().set('token', '', {
        expires: new Date(0),
        path: '/',
    });
}
