'use server';

import z from 'zod';
import { LoginSchema, RegisterSchema } from '@/schemas';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { db } from '../../db/prisma-client';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '../../db/data';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';
import { getVerificationTokenbyToken } from '../../db/verification-token';

export async function login(values: z.infer<typeof LoginSchema>) {
	const validatedFields = LoginSchema.safeParse(values);
	if (!validatedFields.success) {
		return { error: 'Invalid fields' };
	}

	const { email, password } = validatedFields.data;

	// lets check if the email is verified
	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser.password) return { error: 'Invalid Credentials.' };

	if (!existingUser.emailVerified) {
		// Todo: Redirect to verify or show a link
		return { error: 'Email is not verfied yet.' };
	}

	try {
		await signIn('credentials', {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		});
	} catch (error) {
		if (error instanceof AuthError)
			switch (error.type) {
				case 'CredentialsSignin':
					return { error: 'Invalid Credentials.' };
				default:
					return { error: 'Something went wrong' };
			}

		// We have to throw the error for the redirect (next.js quirks)
		throw error;
	}
}

export async function register(values: z.infer<typeof RegisterSchema>) {
	const validateFields = RegisterSchema.safeParse(values);
	if (!validateFields.success) {
		return { error: 'Invalid fields' };
	}

	const { email, password, name, lastName } = validateFields.data;
	const hashedPassword = await bcrypt.hash(password, 10);

	// Check for existing user
	const existingUser = await getUserByEmail(email);
	if (existingUser) return { error: 'Email already exists' };

	try {
		// create user actually
		await db.user.create({
			data: {
				name,
				lastName,
				password: hashedPassword,
				email,
			},
		});
	} catch (error) {
		console.error(error);
		return { error: 'Oh Snap! Something went wrong :(' };
	}

	// create a verification token
	const token = await generateVerificationToken(email);

	// send email with token
	sendVerificationEmail(token.email, token.token);

	// redirect to verification page
	redirect('/auth/login');
}

// token verification
export const newVerification = async (token: string) => {
	const existingToken = await getVerificationTokenbyToken(token);

	if (!existingToken) {
		return { error: 'Token does not exist!' };
	}

	const hasExpired = new Date(existingToken.expiresAt) < new Date();

	if (hasExpired) {
		return { error: 'Token has expired!' };
	}

	const existingUser = await getUserByEmail(existingToken.email);

	if (!existingUser) {
		return { error: 'Email does not exist!' };
	}

	await db.user.update({
		where: { id: existingUser.id },
		data: {
			emailVerified: new Date(),
			email: existingToken.email,
			// update email to the verified one when the user changes it we just update send him new token and the email gets updated
		},
	});

	await db.verificationToken.delete({
		where: { id: existingToken.id },
	});

	return { success: 'Email successfully verified!' };
};
