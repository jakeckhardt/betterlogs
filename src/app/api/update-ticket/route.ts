import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

const PUT = async (request: NextRequest) => {
    const requestData = await request.json();
    
    try {
        const updatedTicket = await sql`UPDATE ticket
            SET ticket_title = ${requestData.ticket_title}, 
                column_title = ${requestData.column_title},
                column_id = ${requestData.column_id}, 
                description = ${requestData.description}, 
                links = ${requestData.links}
            WHERE id = ${requestData.ticket_id}
            RETURNING id, user_id, board_id, ticket_title, column_title, column_id, description, links, date_created;`;
    
        if (requestData.column_change) {
            await sql`UPDATE "column"
                SET tickets = ARRAY_REMOVE(tickets, ${updatedTicket.rows[0].id})
                WHERE board_id = ${requestData.board_id}`;
    
            if (requestData.column_indexes) {
                await sql`UPDATE "column"
                    SET tickets = ${requestData.column_indexes}
                    WHERE id = ${requestData.column_id}
                    RETURNING tickets, id;`;
            } else {
                await sql`UPDATE "column"
                    SET tickets = ARRAY_APPEND(tickets, ${updatedTicket.rows[0].id})
                    WHERE id = ${requestData.column_id}
                    RETURNING tickets, id;`;
            }
        };

        const newColumns = await sql`SELECT * FROM "column" WHERE board_id = ${requestData.board_id};`;

        const newTickets = await sql`SELECT * FROM ticket WHERE board_id = ${requestData.board_id};`;
    
        return NextResponse.json({ newColumns, newTickets }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error });
    }
};

export {PUT};