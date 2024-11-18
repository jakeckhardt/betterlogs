import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

const POST = async (request: Request) => {
    const requestData = await request.json();
    
    try {
        await sql`DELETE FROM ticket
            WHERE id = ${requestData.id};`;

        await sql`UPDATE "column"
            SET tickets = ARRAY_REMOVE(tickets, ${requestData.id})
            WHERE id = ${requestData.column_id}`;

        const newColumns = await sql`SELECT * FROM "column" WHERE board_id = ${requestData.board_id};`;

        const newTickets = await sql`SELECT * FROM ticket WHERE board_id = ${requestData.board_id};`;

        return NextResponse.json({ newColumns, newTickets }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error });
    }
};

export {POST};