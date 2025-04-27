import BoardsLayout from "@/app/layouts/BoardsLayout/BoardsLayout";
import DemoBoardsLayout from "@/app/layouts/DemoBoardsLayout/DemoBoardsLayout";
import { getUrl } from "./helpers/getUrl";
import { isDemo } from "./helpers/checkDemo";
import { cookies } from "next/headers";

export default async function Home() {
  const demo = isDemo();
  
  if (demo) {
    return (
      <DemoBoardsLayout />
    )
  } else {
    const cookieStore = cookies();
    const url = getUrl();
    const session = cookieStore.get('session')!.value;
  
    const res = await fetch(`${url}/api/get-board`,{
      headers: {
        'Authorization': session
      },
      cache: 'no-store'
    });

    const jsonData = await res.json();
    let data = jsonData.rows;

    return (
      <BoardsLayout
        boards={data}
      />
    )
  };
}
