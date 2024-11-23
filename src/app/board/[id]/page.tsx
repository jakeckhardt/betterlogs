import BoardLayout from "@/app/layouts/BoardLayout";
import { getUrl } from "@/app/helpers/getUrl";
import { cookies } from "next/headers";

export default async function Board({
    params: { id }
}: {
    params: { id: string }
}) {
  const url = getUrl();

  const cookieStore = cookies();
  const session = cookieStore.get('session')!.value;

  const boardRes = await fetch(`${url}/api/get-board?id=${id}`,{
    headers: {
      'Authorization': session
    },
    cache: 'no-store'
  });

  const columnRes = await fetch(`${url}/api/get-columns?id=${id}`,{
    headers: {
      'Authorization': session
    },
    cache: 'no-store'
  });

  const ticketsRes = await fetch(`${url}/api/get-tickets?id=${id}`,{
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