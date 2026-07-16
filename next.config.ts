import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/ham-radio-exam" : "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
