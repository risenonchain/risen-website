import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "export", // Enable static export for Capacitor/mobile

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/:path*",
      },
    ];
  },
};

export default nextConfig;