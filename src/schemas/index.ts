import { z } from 'zod';

export const LoginSchema = z.object({
	email: z.string().email('Yeah, that is not an email...'),
	password: z.string().min(1, {
		message: 'Password required',
	}),
});
export const RegisterSchema = z
	.object({
		email: z.string().email('Yeah, that is not an email...'),
		password: z
			.string()
			.min(6, { message: 'Password should be at least 6 characters long' }),
		confirmPassword: z
			.string()
			.min(6, { message: 'Password should be at least 6 characters long' }),
		name: z.string().min(1, { message: 'Name required' }),
		lastName: z.string().min(1, { message: 'Last name required' }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});
