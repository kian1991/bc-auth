import NextAuth, { DefaultSession } from 'next-auth';
import authConfig from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '../db/prisma-client';
import { getUserById } from '../db/data';
import { UserRole } from '@prisma/client';

type ExtendedUser = DefaultSession['user'] & {
	lastName: string;
	role: UserRole;
};

declare module 'next-auth' {
	interface Session {
		user: ExtendedUser;
	}
}

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	callbacks: {
		session: async ({ token, session }) => {
			if (token.role && token.lastName && session.user) {
				session.user.lastName = token.lastName as string;
				session.user.role = token.role as UserRole;
			}
			console.log('session', session);
			return session;
		},
		jwt: async ({ token }) => {
			if (!token.sub) return token;
			const user = await getUserById(token.sub);
			if (!user) return token;
			token.lastName = user.lastName;
			token.role = user.role;
			console.log('token', token);
			return token;
		},
	},
	adapter: PrismaAdapter(db),
	session: {
		strategy: 'jwt',
	},
	...authConfig,
});
