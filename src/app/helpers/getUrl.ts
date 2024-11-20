export async function getUrl() {
    if (process.env.VERCEL_ENV === "production") {
        return `${process.env.PROTOCOL}${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    } else {
        return `${process.env.PROTOCOL}${process.env.VERCEL_URL}`;
    }
};