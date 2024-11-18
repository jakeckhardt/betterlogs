import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

const GET = async () => {
    const { rows } = await sql`SELECT * FROM "user";`;
    return NextResponse.json({ rows }, { status: 200 });
};

export {GET};