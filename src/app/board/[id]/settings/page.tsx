import { getUrl } from "@/app/helpers/getUrl";
import { cookies } from "next/headers";
import BoardSettings from "@/app/components/BoardSettings/BoardSettings";

export default async function BoardSettingsPage({
    params: { id }
} : {
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

    const boardData = await boardRes.json();

    return (
        <BoardSettings
            boardData={boardData.rows[0]}
        />
    )
};