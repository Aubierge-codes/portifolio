import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  async headers() {
    return [
      {
        // The GLBs are the heaviest requests on the page. Their filenames are
        // not content-hashed, so cache for a day and revalidate in the
        // background rather than marking them immutable — a re-exported model
        // still reaches visitors within a day without a rename.
        source: "/models/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
