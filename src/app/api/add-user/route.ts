import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signAuth } from '../../helpers/auth';

const POST = async (request: Request) => {

    const requestData = await request.json();

    const userExist = await sql`SELECT * FROM "user" WHERE email = ${requestData.email};`;

    if (userExist.rows.length > 0) {
        return NextResponse.json({ message: "User already exists"}, { status: 500 });
    }
    
    try {
        const hashedPass = await bcrypt.hash(requestData.password, 10);

        await sql`INSERT INTO "user" (firstname, lastname, email, password) 
            VALUES (${requestData.firstname}, ${requestData.lastname}, ${requestData.email}, ${hashedPass});`;
        
        const token = await signAuth({
                firstname: requestData.firstname,
                lastname: requestData.lastname,
                email: requestData.email,
                password: requestData.password,
            } 
        );

        return NextResponse.json({
            message: "Sign up successful",
            auth: true,
            token: token
        }, {status: 200});
    } catch (error) {
        return NextResponse.json({ error });
    }

    const users = await sql`SELECT * FROM "user";`;
    return NextResponse.json({ users }, { status: 200 });
};

export {POST};
