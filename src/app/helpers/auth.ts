import { jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(
    process.env.NEXT_PUBLIC_JWT_SECRET
);

interface token {
    data: {
        id: number,
        firstname: string,
        lastname: string,
        email: string,
        password: string
    } | undefined
};

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
    console.log("Verifying auth: ", token);
    try {
        const { payload } = await jwtVerify<token>(token, secret);
        return payload;
    } catch (error) {
        console.log(error);
    }
};
