import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

const GET = async (request: any) => {

    const params = request.nextUrl.searchParams.get("id");
    const { rows } = await sql`SELECT * FROM ticket WHERE board_id = ${params};`;
    return NextResponse.json({ rows }, { status: 200 });
};

export {GET};