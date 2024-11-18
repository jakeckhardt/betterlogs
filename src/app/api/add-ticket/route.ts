import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { verifyAuth } from '../../helpers/auth';

const POST = async (request: Request) => {
    const auth = request.headers.get('Authorization');
    const decoded = await verifyAuth(auth!).catch((err: Error) => {
        console.log(err);
    });

    const userID = decoded.data.id;
    const requestData = await request.json();

    const now = new Date(),
        year = now.getFullYear(),
        month = now.getMonth() + 1,
        date = now.getDate(),
        newDate = `${year}/${month.toString().padStart(2, "0")}/${date.toString().padStart(2, "0")}`;

    // CREATE TABLE ticket (
    //     id SERIAL PRIMARY KEY,
    //     user_id INT NOT NULL,
    //     board_id INT NOT NULL,
    //     column_id INT NOT NULL,
    //     ticket_title VARCHAR(255) NOT NULL,
    //     column_title VARCHAR(255) NOT NULL,
    //     date_created DATE NOT NULL
    // );
    
    try {
        const newTicket = await sql`INSERT INTO ticket (user_id, board_id, column_id, ticket_title, column_title, links, description, date_created) 
            VALUES (
                ${userID}, 
                ${requestData.board_id}, 
                ${requestData.column_id}, 
                ${requestData.ticket_title}, 
                ${requestData.column_title},
                ${requestData.links},
                ${requestData.description}, 
                ${newDate})
            RETURNING id, board_id, user_id, column_id;`;

        await sql`UPDATE "column"
            SET tickets = ARRAY_APPEND(tickets, ${newTicket.rows[0].id})
            WHERE id = ${requestData.column_id}
            RETURNING tickets, id;`;

        await sql`UPDATE board
            SET updated_last = ${newDate}
            WHERE id = ${requestData.board_id}`;

        const newColumns = await sql`SELECT * FROM "column" WHERE board_id = ${requestData.board_id};`;

        const newTickets = await sql`SELECT * FROM ticket WHERE board_id = ${requestData.board_id};`;

        return NextResponse.json({ newColumns, newTickets }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error });
    }
};

export {POST};