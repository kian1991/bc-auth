'use server';

import z from 'zod';
import { LoginSchema, RegisterSchema } from '@/schemas';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';

export async function login(values: z.infer<typeof LoginSchema>) {
	const validateFields = LoginSchema.safeParse(values);
	if (!validateFields.success) {
		return { error: 'Invalid fields' };
	}

	const { email, password } = validateFields.data;

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
	const existingUser = await db.user.findUnique({
		where: {
			email,
		},
	});
	if (existingUser) return { error: 'Email already exists' };

	// create user actually
	await db.user.create({
		data: {
			name,
			lastName,
			password: hashedPassword,
			email,
		},
	});

	// implement success toast and verification email
	return redirect('/');
}
