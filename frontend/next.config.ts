import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/hr', destination: '/hr/employees', permanent: false },
      { source: '/finance', destination: '/finance/overview', permanent: false },
      { source: '/inventory', destination: '/inventory/stock', permanent: false },
    ];
  },
};

export default nextConfig;
