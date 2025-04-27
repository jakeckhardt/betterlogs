import { cookies } from 'next/headers';

export const isDemo = () => {
    const cookieStore = cookies();
    const demo = cookieStore.get('session-demo')?.value;
    return demo === "true";
};