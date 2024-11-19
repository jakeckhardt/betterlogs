import { jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(
    process.env.NEXT_PUBLIC_JWT_SECRET
);

export const signAuth = async (data: Record<string, Uint16Array>,) => {
    try {
        const signed = await new SignJWT({data})
            .setProtectedHeader({ alg: 'HS256'})
            .setExpirationTime("2h")
            .sign(secret);

        return signed;
    } catch (error) {
        console.log(error);
    }
};

export const verifyAuth = async (token: string) => {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (error) {
        console.log(error);
    }
};
