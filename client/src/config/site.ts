export const siteConfig = {
    name: "VinZ-XpenZ",
    description: "Drive analytics on your expenses with AI!",
    url: "https://vinz-xpenz.vercel.app",
    ogImage: "/icon.png",
    links: {
        github: "https://github.com/VinZCodz/llm-generative-ui",
    },
    currency: {
        symbol: "₹", // Change this to $, €, £, etc.
        code: "INR",
        locale: "en-IN"
    },
};

export type SiteConfig = typeof siteConfig;
