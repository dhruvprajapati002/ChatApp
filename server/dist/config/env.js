import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load environment variables once
config({ path: resolve(__dirname, '../../.env') });
// Export all config
export const ENV = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/pulsechat',
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    NODE_ENV: process.env.NODE_ENV || 'development',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};
// Validate critical environment variables
export const validateEnv = () => {
    const required = ['JWT_SECRET', 'MONGO_URI', 'EMAIL_USER', 'EMAIL_PASS'];
    const missing = required.filter(key => !ENV[key]);
    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:', missing.join(', '));
        throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }
    console.log('✅ All required environment variables are set');
};
