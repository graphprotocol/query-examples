import { fileURLToPath } from 'node:url';
import createJiti from 'jiti';
const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env files here to validate during build
jiti('./env/server');

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
