import BoardLayout from "@/app/layouts/BoardLayout";
import { cookies } from "next/headers";

export default async function Board({
    params: { id }
}: {
    params: { id: string }
}) {

  const cookieStore = cookies();
  const session = cookieStore.get('session')!.value;

  let boardRes = await fetch(`http://localhost:3000/api/get-board?id=${id}`,{
    headers: {
      'Authorization': session
    },
    cache: 'no-store'
  });

  let ticketsRes = await fetch(`http://localhost:3000/api/get-tickets?id=${id}`,{
    headers: {
      'Authorization': session
    },
    cache: 'no-store'
  });

  let boardData = await boardRes.json();
  let ticketData = await ticketsRes.json();

  return (
    <BoardLayout
      board={boardData.rows[0]}
      tickets={ticketData.rows}
    />
  );
}