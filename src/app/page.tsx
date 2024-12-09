import BoardsLayout from "@/app/layouts/BoardsLayout.js";
import { getUrl } from "./helpers/getUrl";
import { cookies } from "next/headers";

export default async function Home() {
  const url = getUrl();
  const cookieStore = cookies();
  const session = cookieStore.get('session')!.value;

  console.log("Session token", session);
  console.log(`Making home page fetch to ${url}/api/get-board`);
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
