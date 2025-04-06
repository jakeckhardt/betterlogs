import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

const POST = async (request: Request) => {
    const requestData = await request.json();
    
    try {
        await sql`DELETE FROM "column"
            WHERE id = ${requestData.id}`;

        if (requestData.tickets.length > 0) {
            await sql`DELETE FROM ticket
                WHERE column_id = ${requestData.id}`;
        };

        const newBoard = await sql`UPDATE board 
            SET columns = ARRAY_REMOVE(columns, ${requestData.id}),
                categories = ARRAY_REMOVE(categories, ${requestData.column_title})
            WHERE id = ${requestData.board_id};`;

        return NextResponse.json({ newBoard }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error });
    }
};

export {POST};