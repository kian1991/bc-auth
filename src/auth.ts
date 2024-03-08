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
		jwt: async ({ token }) => {
			const { sub: userId } = token;
			if (!userId) return token;
			// get user from db by 'sub' (id)
			const user = await getUserById(userId);
			if (!user) return token;
			token.lastName = user.lastName;
			token.role = user.role;
			return token;
		},
		session: ({ token, session }) => {
			if (token.role && token.lastName && session.user) {
				session.user.lastName = token.lastName as string;
				session.user.role = token.role as UserRole;
			}
			return session;
		},
	},
	adapter: PrismaAdapter(db),
	session: {
		strategy: 'jwt',
	},
	...authConfig,
});
