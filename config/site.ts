export const siteConfig = {
  name: "TO DO",
  description: "TO DO 웹 애플리케이션입니다.",
  url: process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000",
  ogImage: `${process.env.VERCEL_URL}/logo.png`,
  links: {
    twitter: "https://twitter.com/andongmin94",
    github: "https://github.com/andongmin94",
  },
};
