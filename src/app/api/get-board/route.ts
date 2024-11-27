import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from '../../helpers/auth';

const GET = async (request: NextRequest) => {
    console.log("Authorizing userId for boards fetch");
    const auth = request.headers.get('Authorization');
    const decoded = await verifyAuth(auth!).catch((err: Error) => {
        console.error(err, auth);
    });

    const userID = decoded?.data?.id;

    if (request.nextUrl.searchParams.get("id")) {
        const params = request.nextUrl.searchParams.get("id");
        const { rows } = await sql`SELECT * FROM board WHERE id = ${params};`;
        return NextResponse.json({ rows }, { status: 200 });
    };

    const { rows } = await sql`SELECT * FROM board WHERE user_id = ${userID};`;
    return NextResponse.json({ rows }, { status: 200 });
};

export {GET};