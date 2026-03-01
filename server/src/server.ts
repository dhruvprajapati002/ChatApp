// Load environment variables FIRST
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from root directory
config({ path: resolve(__dirname, '../.env') });

// Debug: Print environment variables
console.log('\n🔍 Environment Check: from the server.ts');
console.log('📧 EMAIL_USER:', process.env.EMAIL_USER || '❌ Not found');
console.log('🔑 EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set (hidden)' : '❌ Not found');
console.log('🔐 JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set (hidden)' : '❌ Not found');
console.log('🌐 CLIENT_URL:', process.env.CLIENT_URL || '❌ Not found');
console.log('');


import { createServer } from 'http';
import app from './app.js';  // Added .js
import { connectDB } from './config/db.js';  // Added .js
import { initializeSocket } from './socket/index.js';  // Added .js



const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

initializeSocket(httpServer);

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("CI/CD working 🚀");
  });
});
