import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

const PUT = async (request: any) => {
    const requestData = await request.json();

    let now = new Date(),
        year = now.getFullYear(),
        month = now.getMonth() + 1,
        date = now.getDate(),
        newDate = `${year}/${month.toString().padStart(2, "0")}/${date.toString().padStart(2, "0")}`;
    
    try {
        let updatedTicket = await sql`UPDATE ticket
            SET ticket_title = ${requestData.title}, category = ${requestData.category}
            WHERE id = ${requestData.ticket_id}
            RETURNING id, board_id, user_id, ticket_title, category, date_created;`;

        return NextResponse.json({ updatedTicket }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error });
    }
};

export {PUT};