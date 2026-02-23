// ...existing code...
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // transpile packages that ship TS/ESM source in node_modules
  transpilePackages: [
    "expo-modules-core",
    "expo-secure-store",
    "expo",
    "react-native",
  ],

  async rewrites() {
    const apiUrl = process.env.API_URL || "http://localhost:3000";
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: `${apiUrl}/api/:path*`,
        },
      ],
    };
  },

  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/auth",
  },
};

export default nextConfig;
// ...existing code...