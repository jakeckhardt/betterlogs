import BoardsLayout from "@/app/layouts/BoardsLayout.js";
import { getUrl } from "./helpers/getUrl";
import { cookies } from "next/headers";

export default async function Home() {
  console.log("Hit home page");
  const url = getUrl();
  const cookieStore = cookies();
  const session = cookieStore.get('session')!.value;

  console.log("Making home page fetch");
  const res = await fetch(`${url}/api/get-board`,{
    headers: {
      'Authorization': session
    },
    cache: 'no-store'
  });
  const data = await res.json();

  console.log(data);

  return (
    <BoardsLayout 
      boards={data.rows}
    />
  );
}
