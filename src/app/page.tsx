import BoardsLayout from "@/app/layouts/BoardsLayout.js";
import { getUrl } from "./helpers/getUrl";
import { cookies } from "next/headers";

export default async function Home() {
  const url = getUrl();
  const cookieStore = cookies();
  const session = cookieStore.get('session')!.value;

  let data;

  try {
    const res = await fetch(`${url}/api/get-board`,{
      headers: {
        'Authorization': session
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      // Handle non-200 status codes
      console.error(`Request failed: ${res.status}`);
      const errorText = await res.text(); // Read the response body as text to see the error page
      console.error(errorText); // Log the response body (likely an HTML error page)
      return;
    }

    data = await res.json();
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return (
    <BoardsLayout 
      boards={data.rows}
    />
  );
}
