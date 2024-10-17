/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    experimental: {
        missingSuspenseWithCSRBailout: false
    },
    images: {
        remotePatterns: [
            {
                hostname: 'mobilecommerce.oneentry.cloud'
            }
        ]
    }
};

export default nextConfig;
