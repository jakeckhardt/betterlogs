import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { verifyAuth } from '../../helpers/auth';

const POST = async (request: Request) => {

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

    const now = new Date(),
        year = now.getFullYear(),
        month = now.getMonth() + 1,
        date = now.getDate(),
        newDate = `${year}/${month.toString().padStart(2, "0")}/${date.toString().padStart(2, "0")}`,
        defaultColumns = ["Plan", "Doing", "Done"];

    // CREATE TABLE board (
    //     id SERIAL PRIMARY KEY,
    //     user_id INT NOT NULL,
    //     board_title VARCHAR(255) NOT NULL,
    //     date_created DATE NOT NULL
    // );
    
    try {
        const newBoardInit = await sql`INSERT INTO board (user_id, board_title, date_created, updated_last) 
            VALUES (${userID}, ${requestData.title}, ${newDate}, ${newDate})
            RETURNING id, board_title, date_created, updated_last;`;
        
        const columnIds: number[] = [];

        for (let i = 0; i < defaultColumns.length; i++) {
            const column = await sql`INSERT INTO "column" (board_id, column_title, tickets)
                VALUES (${newBoardInit.rows[0].id}, ${defaultColumns[i]}, array[]::int[])
                RETURNING id`;
            
            columnIds.push(column.rows[0].id);
        };

        const columnIdsString = `{${columnIds.join(',')}}`;

        const newBoard = await sql`UPDATE board
            SET columns = ${columnIdsString}
            WHERE id = ${newBoardInit.rows[0].id}
            RETURNING id, board_title, date_created, updated_last, columns`;

        return NextResponse.json({ newBoard }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error });
    }
};

export {POST};
