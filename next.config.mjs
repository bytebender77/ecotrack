/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['cdn.weatherapi.com', 'openweathermap.org'],
    },
};

export default nextConfig;
