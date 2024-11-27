import BoardsLayout from "@/app/layouts/BoardsLayout.js";
import { getUrl } from "./helpers/getUrl";
import { cookies } from "next/headers";

export default async function Home() {
  const url = getUrl();
  const cookieStore = cookies();
  const session = cookieStore.get('session')!.value;

  const res = await fetch(`/api/get-board`,{
    headers: {
      'Authorization': session
    },
    cache: 'no-store'
  });
  const data = await res.json();

  return (
    <BoardsLayout 
      boards={data.rows}
    />
  );
}
