import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   allowedDevOrigins: [
    '192.168.0.121',
    'localhost',
    // '*.your-local-domain.local'
  ],
  reactCompiler: true,
};

export default nextConfig;
