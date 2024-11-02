// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['your-s3-url.com'], // Replace with your actual S3 bucket domain
    },
  };
  
  export default nextConfig;
  