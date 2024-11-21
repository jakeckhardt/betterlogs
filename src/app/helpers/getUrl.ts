export async function getUrl() {
    const protocol = process.env.PROTOCOL || "http://";
    
    const url = process.env.VERCEL_ENV === "production"
        ? process.env.VERCEL_PROJECT_PRODUCTION_URL
        : process.env.VERCEL_URL;

    if (!url) {
        console.error("Vercel URL is undefined. Please check your environment variables.");
        return `http://localhost:3000`;
    }

    return `${protocol}${url}`;
}