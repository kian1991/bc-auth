'use server';

import z from 'zod';
import { LoginSchema, RegisterSchema } from '@/schemas';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';

export async function login(values: z.infer<typeof LoginSchema>) {
	const validateFields = LoginSchema.safeParse(values);
	if (!validateFields.success) {
		return { error: 'Invalid fields' };
	}

	await new Promise((resolve) => setTimeout(resolve, 1000));
	console.log(values);

	return { error: 'Credentials not found' };
	return redirect('/');
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
