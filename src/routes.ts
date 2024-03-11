/**
 * Array of routes accessable publicly
 */
export const publicRoutes = ['/', '/auth/new-verification'];
/**
 * Array of routes used for auth
 */
export const authRoutes = ['/auth/login', '/auth/register', '/auth/error'];

// Routes for auth api purposes
export const apiAuthPrefix = '/api/auth';

// Default redirect after login
export const DEFAULT_LOGIN_REDIRECT = '/settings';
