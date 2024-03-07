import authConfig from './auth.config';
import NextAuth from 'next-auth';
import {
	publicRoutes,
	DEFAULT_LOGIN_REDIRECT,
	authRoutes,
	apiAuthPrefix,
} from './routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;

	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);

	if (isApiAuthRoute) return; // dont do anything

	if (isAuthRoute) {
		// redirect to settings if logged in
		if (isLoggedIn) Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)); // Why nextUrl? Because we want to construct a absolute route!
		return;
	}

	if (!isLoggedIn && !isPublicRoute) {
		// User isnt logged in and tries to access protected route
		return Response.redirect(new URL('/auth/login', nextUrl));
	}

	return;
});

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
