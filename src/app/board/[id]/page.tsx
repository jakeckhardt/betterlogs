import BoardLayout from "@/app/layouts/BoardLayout";
import { cookies } from "next/headers";

export default async function Board({
    params: { id }
}: {
    params: { id: string }
}) {

  const cookieStore = cookies();
  const session = cookieStore.get('session')!.value;

  const boardRes = await fetch(`http://localhost:3000/api/get-board?id=${id}`,{
    headers: {
      'Authorization': session
    },
    cache: 'no-store'
  });

  const columnRes = await fetch(`http://localhost:3000/api/get-columns?id=${id}`,{
    headers: {
      'Authorization': session
    },
    cache: 'no-store'
  });

  const ticketsRes = await fetch(`http://localhost:3000/api/get-tickets?id=${id}`,{
    headers: {
      'Authorization': session
    },
    cache: 'no-store'
  });

  const boardData = await boardRes.json(),
    columnData = await columnRes.json(),
    ticketData = await ticketsRes.json();

  return (
    <BoardLayout
      boardData={boardData.rows[0]}
      columnsData={columnData.rows}
      ticketData={ticketData.rows}
    />
  );
}