export const getUrl = () => {
    const env = process.env.NEXT_PUBLIC_VERCEL_ENV,
        protocol = process.env.NEXT_PUBLIC_PROTOCOL,
        url = process.env.NEXT_PUBLIC_VERCEL_URL,
        productionUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;

    if (env === "production") {
        return `${protocol}${productionUrl}`;
    } else {
        return `${protocol}${url}`;
    }
};
