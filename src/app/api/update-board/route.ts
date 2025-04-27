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

        const currColumns = await sql`SELECT * FROM "column" WHERE board_id = ${requestData.id};`;

        for (const column of currColumns.rows) {
            if (!requestData.columns.includes(column.id)) {
                await sql`DELETE FROM "column"
                    WHERE id = ${column.id}`;
            }
        };

        for (const [index, column] of requestData.columns.entries()) {
            if (column === -1) {
                const newColumn = await sql`INSERT INTO "column" (board_id, column_title, tickets) 
                    VALUES (${requestData.id}, ${requestData.categories[index]}, ARRAY[]::INTEGER[])
                    RETURNING id;`;

                requestData.columns[index] = newColumn.rows[0].id;
            } else {
                await sql`UPDATE "column"
                    SET column_title = ${requestData.categories[index]}
                    WHERE id = ${column}`;
            }
        };

        const updatedBoard = await sql`UPDATE board
            SET board_title = ${requestData.board_title}, 
                categories = ${requestData.categories},
                columns = ${requestData.columns},
                updated_last = ${newDate}
            WHERE id = ${requestData.id}
            RETURNING id, 
                      user_id, 
                      board_title,
                      categories,
                      columns;`;

        return NextResponse.json({ updatedBoard }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error });
    }
};

export {PUT};