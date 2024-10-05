import { sql } from "@vercel/postgres";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

const GET = async (
    request: NextApiRequest,
    context: { params: { id: string }}
) => {

    const { id } = context.params;

    const boards = await sql`SELECT * FROM board where id = ${id};`;
    return NextResponse.json({ boards }, { status: 200 });
};

export {GET};