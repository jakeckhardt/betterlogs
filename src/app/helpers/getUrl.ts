export const getUrl = () => {
    const env = process.env.NEXT_PUBLIC_VERCEL_ENV,
        url = process.env.NEXT_PUBLIC_VERCEL_URL,
        productionUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;

    if (env === "production") {
        return `https://${productionUrl}`;
    } else {
        return `https://${url}`;
    }
};
