import NextAuth, { DefaultSession } from 'next-auth';
import authConfig from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '../db/prisma-client';
import { getUserById } from '../db/data';
import { UserRole } from '@prisma/client';

type ExtendedUser = DefaultSession['user'] & {
	lastName: string | null;
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
	pages: {
		signIn: '/../../auth/login',
		error: '/../../auth/error',
	},
	callbacks: {
		signIn: async ({ user, account }) => {
			console.log('signingin user', user, account);
			// check if user is signing in using credentials and the email is verified
			// Allow OAuth
			if (account?.provider !== 'credentials') return true; // undefined wont be 'credentials' => ?
			if (!user || !user.id) return false;
			const existingUser = await getUserById(user.id);
			if (!existingUser?.emailVerified) return false;
			return true;
		},
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
			if (token.role && session.user) {
				session.user.lastName = (token.lastName as string) || null;
				session.user.role = token.role as UserRole;
			}
			return session;
		},
	},
	events: {
		linkAccount: async ({ user }) => {
			// with social login users are automatically verified
			await db.user.update({
				where: { id: user.id },
				data: { emailVerified: new Date() },
			}); // update user
		},
	},
	adapter: PrismaAdapter(db),
	session: {
		strategy: 'jwt',
	},
	...authConfig,
});
