import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    allowedDevOrigins: ["192.168.170.203"],
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        },
    },

};

export default nextConfig;
