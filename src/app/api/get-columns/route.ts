import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

const GET = async (request: NextRequest) => {

    const params = request.nextUrl.searchParams.get("id");
    const { rows } = await sql`SELECT * FROM "column" WHERE board_id = ${params};`;
    return NextResponse.json({ rows }, { status: 200 });
};

export {GET};