import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { verifyAuth } from '../../helpers/auth';

const POST = async (request: any) => {
    const auth = request.headers.get('Authorization');
    const decoded = await verifyAuth(auth!).catch((err: Error) => {
        console.log(err);
    });

    const userID = decoded.data.id;
    console.log(request);
    const requestData = await request.json();
    console.log(requestData);

    let now = new Date(),
        year = now.getFullYear(),
        month = now.getMonth() + 1,
        date = now.getDate(),
        newDate = `${year}/${month.toString().padStart(2, "0")}/${date.toString().padStart(2, "0")}`;

    // CREATE TABLE ticket (
    //     id SERIAL PRIMARY KEY,
    //     user_id INT NOT NULL,
    //     board_id INT NOT NULL,
    //     ticket_title VARCHAR(255) NOT NULL,
    //     date_created DATE NOT NULL
    // );
    
    try {
        let newTicket = await sql`INSERT INTO ticket (board_id, user_id, ticket_title, category, date_created) 
            VALUES (${requestData.board_id}, ${userID}, ${requestData.title}, ${requestData.category}, ${newDate})
            RETURNING id, board_id, user_id, ticket_title, category, date_created;`;

        return NextResponse.json({ newTicket }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error });
    }
};

export {POST};