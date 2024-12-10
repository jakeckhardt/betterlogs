export const getUrl = () => {
    const env = process.env.NEXT_PUBLIC_VERCEL_ENV,
        url = process.env.NEXT_PUBLIC_VERCEL_URL,
        previewUrl = process.env.VERCEL_BRANCH_URL,
        productionUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;

    if (env === "production") {
        return `https://${productionUrl}`;
    } else if (env === "preview") {
        return `https://${previewUrl}`;
    } else {
        return `https://${url}`;
    }
};
