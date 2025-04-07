import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signAuth } from '../../helpers/auth';

const POST = async (request: Request) => {

    const requestData = await request.json();

    const userExist = await sql`SELECT * FROM "user" WHERE email = ${requestData.email};`;

    if (userExist.rows.length > 0) {
        return NextResponse.json({ message: "User already exists"}, { status: 500 });
    }
    
    try {
        const hashedPass = await bcrypt.hash(requestData.password, 10);

        const newUserData = await sql`INSERT INTO "user" (firstname, lastname, email, password) 
            VALUES (${requestData.firstname}, ${requestData.lastname}, ${requestData.email}, ${hashedPass})
            RETURNING id;`;

        const now = new Date(),
            year = now.getFullYear(),
            month = now.getMonth() + 1,
            date = now.getDate(),
            newDate = `${year}/${month.toString().padStart(2, "0")}/${date.toString().padStart(2, "0")}`,
            defaultColumns = ["Plan", "Doing", "Done"];

        const newBoardData = await sql`INSERT INTO board (user_id, board_title, date_created, updated_last) 
            VALUES (${newUserData.rows[0].id}, 'My First Board', ${newDate}, ${newDate})
            RETURNING id;`;

        const columnIds: number[] = [];

        for (let i = 0; i < defaultColumns.length; i++) {
            const column = await sql`INSERT INTO "column" (board_id, column_title, tickets)
                VALUES (${newBoardData.rows[0].id}, ${defaultColumns[i]}, array[]::int[])
                RETURNING id`;
            
            columnIds.push(column.rows[0].id);
        };

        const columnIdsString = `{${columnIds.join(',')}}`;

        await sql`UPDATE board
            SET columns = ${columnIdsString}
            WHERE id = ${newBoardData.rows[0].id}
            RETURNING id, board_title, date_created, updated_last, columns`;

        const token = await signAuth({
            id: newUserData.rows[0].id,
            firstname: requestData.firstname,
            lastname: requestData.lastname,
            email: requestData.email,
            password: requestData.password,
        });

        return NextResponse.json({
            message: "Sign up successful",
            auth: true,
            token: token,
        }, {status: 200});
    } catch (error) {
        return NextResponse.json({ error });
    }
};

export {POST};
