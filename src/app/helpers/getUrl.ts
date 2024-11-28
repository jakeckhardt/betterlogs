export const getUrl = () => {
    const env = process.env.NEXT_PUBLIC_VERCEL_ENV;

    if (env === "production") {
        return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
    } else if (env === "preview") {
        return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    } else {
        return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    }
};
