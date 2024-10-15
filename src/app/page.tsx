import BoardsLayout from "@/app/layouts/BoardsLayout.js";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = cookies();
  const session = cookieStore.get('session')!.value;

  let res = await fetch("http://localhost:3000/api/get-board",{
    headers: {
      'Authorization': session
    },
    cache: 'no-store'
  });
  let data = await res.json();

  return (
    <BoardsLayout 
      boards={data.rows}
    />
  );
}
