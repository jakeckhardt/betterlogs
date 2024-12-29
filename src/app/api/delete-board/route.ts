import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

const POST = async (request: Request) => {
    const requestData = await request.json();
    
    try {
        await sql`DELETE FROM board
            WHERE id = ${requestData.id};`;

        await sql`DELETE FROM "column"
            WHERE board_id = ${requestData.id}`;

        await sql`DELETE FROM ticket
            WHERE board_id = ${requestData.id}`;

        return NextResponse.json({ message: "Board deleted" }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error });
    }
};

export {POST};