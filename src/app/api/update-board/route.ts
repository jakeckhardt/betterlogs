import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

const PUT = async (request: NextRequest) => {
    const requestData = await request.json();

    const now = new Date(),
        year = now.getFullYear(),
        month = now.getMonth() + 1,
        date = now.getDate(),
        newDate = `${year}/${month.toString().padStart(2, "0")}/${date.toString().padStart(2, "0")}`;
    
    try {
        const updatedBoard = await sql`UPDATE board
            SET board_title = ${requestData.title}, 
                categories = ${requestData.categories},
                tickets = ${requestData.tickets},
                updated_last = ${newDate}
            WHERE id = ${requestData.board_id}
            RETURNING id, 
                      user_id, 
                      board_title,
                      categories, 
                      tickets;`;

        return NextResponse.json({ updatedBoard }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error });
    }
};

export {PUT};