import BoardsLayout from "@/app/layouts/BoardsLayout.js";
import { cookies } from "next/headers";
import { getUrl } from "./helpers/getUrl";

export default async function Home() {
  const cookieStore = cookies();
  const session = cookieStore.get('session')!.value;
  const url = await getUrl();

  console.log(url);
  const res = await fetch(`${url}/api/get-board`,{
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
