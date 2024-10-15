import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { verifyAuth } from '../../helpers/auth';

const POST = async (request: any) => {

    const auth = request.headers.get('Authorization');
    const decoded = await verifyAuth(auth!).catch((err: Error) => {
        console.log(err);
    });

    const decodeData = {
        data: {
            id: decoded?.data?.id
        }
    };

    const userID = decodeData.data?.id;

    const requestData = await request.json();

    let now = new Date(),
        year = now.getFullYear(),
        month = now.getMonth() + 1,
        date = now.getDate(),
        newDate = `${year}/${month.toString().padStart(2, "0")}/${date.toString().padStart(2, "0")}`;

    // CREATE TABLE board (
    //     id SERIAL PRIMARY KEY,
    //     user_id INT NOT NULL,
    //     board_title VARCHAR(255) NOT NULL,
    //     date_created DATE NOT NULL
    // );
    
    try {
        let newBoard = await sql`INSERT INTO board (user_id, board_title, date_created) 
            VALUES (${userID}, ${requestData.title}, ${newDate})
            RETURNING id, board_title, date_created, updated_last, tickets;`;

        return NextResponse.json({ newBoard }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error });
    }
};

export {POST};