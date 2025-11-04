import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   /* config options here */
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },

  /* config options here */
};

export default nextConfig;
