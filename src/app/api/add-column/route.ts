import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

const POST = async (request: Request) => {
    const requestData = await request.json();
    
    try {
        const newColumn = await sql`INSERT INTO "column" (board_id, column_title, tickets) 
            VALUES (
                ${requestData.board_id}, 
                ${requestData.column_title},
                array[]::int[])
            RETURNING id, board_id, column_title, tickets;`;

        const updatedBoard = await sql`UPDATE board
            SET columns = ARRAY_APPEND(columns, ${newColumn.rows[0].id}),
                categories = ARRAY_APPEND(categories, ${newColumn.rows[0].column_title})
            WHERE id = ${requestData.board_id}
            RETURNING id, user_id, board_title, categories, columns;`;

        return NextResponse.json({ newColumn, updatedBoard }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error });
    }
};

export {POST};