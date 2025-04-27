import BoardLayout from "@/app/layouts/BoardLayout/BoardLayout";
import DemoBoardLayout from "@/app/layouts/DemoBoardLayout/DemoBoardLayout";
import { getUrl } from "@/app/helpers/getUrl";
import { isDemo } from "@/app/helpers/checkDemo";
import { cookies } from "next/headers";

export default async function Board({
    params: { id }
}: {
    params: { id: string }
}) {
  const demo = isDemo();

  if (demo) {
    return (
      <DemoBoardLayout 
        boardID={Number(id)}
      />
    )
  } else {
    const cookieStore = cookies();
    const session = cookieStore.get('session')!.value;
    const url = getUrl();
  
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
  
    let boardData = await boardRes.json(),
        columnData = await columnRes.json(),
        ticketData = await ticketsRes.json();

    return (
      <BoardLayout
        demo={false}
        boardData={boardData.rows[0]}
        columnsData={columnData.rows}
        ticketData={ticketData.rows}
      />
    )
  }
}