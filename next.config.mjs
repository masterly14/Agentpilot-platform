/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Without this, Next refuses to serve /_next/* to phones hitting the dev server through a
  // tunnel or the LAN IP, so the page ships its HTML but never boots any JavaScript.
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok.app",
    "*.ngrok.io",
    "*.trycloudflare.com",
    "*.loca.lt",
    "192.168.0.0/16",
    "10.0.0.0/8",
  ],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "3auasoi81o.ucarecd.net",
      },
      {
        protocol: "https",
        hostname: "2znuw33nvj.ucarecd.net",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/api/ebook/download": ["./content/ebook.pdf"],
  },
}

export default nextConfig
