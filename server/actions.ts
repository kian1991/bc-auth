'use server';

import z from 'zod';
import { LoginSchema, RegisterSchema } from '@/schemas';
import { redirect } from 'next/navigation';
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

	await new Promise((resolve) => setTimeout(resolve, 1000));
	console.log(values);
	return { error: 'User already exists' };
	return redirect('/');
}
