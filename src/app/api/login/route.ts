import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signAuth } from '../../helpers/auth';

const POST = async (request: Request) => {

    const requestData = await request.json();
    const user = await sql`SELECT * FROM "user" WHERE email = ${requestData.email};`;

    if (user.rows.length < 0) {
        return NextResponse.json({ message: "Username or password incorrect"}, { status: 404 });
    }
    
    try {
        const match = await bcrypt.compare(requestData.password, user.rows[0].password);

        if (match) {
            const token = await signAuth(
                {   
                    id: user.rows[0].id,
                    firstname: user.rows[0].firstname,
                    lastname: user.rows[0].lastname,
                    email: user.rows[0].email,
                    password: user.rows[0].password,
                }   
            );
            return NextResponse.json({ 
                message: "Login successful",
                auth: true,
                token: token  
            }, { status: 200});
        } else {
            return NextResponse.json({ message: "Username or password incorrect"}, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error });
    }
};

export {POST};
