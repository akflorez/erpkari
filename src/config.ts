// Dynamic backend URL detection for production and development
// In production, all traffic goes through Nginx proxy at /wa/
// In development, connect directly to localhost:3001

// Detection for development mode
export const isDev = window.location.port === '5173' || 
              window.location.hostname === 'localhost' || 
              window.location.hostname === '127.0.0.1' ||
              window.location.hostname.startsWith('192.168.') ||
              window.location.hostname.startsWith('10.');

// Base URL for HTTP API calls (fetch)
// Use the current hostname to allow access from other devices on the same network
export const WA_API_URL = isDev ? `http://${window.location.hostname}:3001` : '/wa';

// Socket.io connection config
export const WA_SOCKET_URL = isDev ? `http://${window.location.hostname}:3001` : window.location.origin;

// Path must MATCH what Nginx expect (/wa/socket.io becomes /socket.io in backend)
export const WA_SOCKET_PATH = isDev ? '/socket.io' : '/wa/socket.io';
