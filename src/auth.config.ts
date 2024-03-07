import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import type { NextAuthConfig } from 'next-auth';
import { LoginSchema } from './schemas';
import { db } from './lib/db';
import { User } from '@prisma/client';

export default {
	providers: [
		GitHub,
		Google,
		Credentials({
			async authorize(
				credentials: Partial<Record<string, unknown>>
			): Promise<User | null> {
				const validatedFields = LoginSchema.safeParse(credentials);

				if (validatedFields.success) {
					const { email, password } = validatedFields.data;
					// check if user exists
					const user = await db.user.findUnique({ where: { email } });

					if (!user || !user.password) return null; // no pass because oauth

					// compare passwords
					const passwordsMatch = await bcrypt.compare(password, user.password);

					if (passwordsMatch) return user;
				}

				return null;
			},
		}),
	],
} satisfies NextAuthConfig;
