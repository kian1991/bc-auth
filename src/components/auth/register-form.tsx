'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	IconBrandGoogle,
	IconBrandGithub,
	IconExclamationMark,
} from '@tabler/icons-react';
import Link from 'next/link';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { z } from 'zod';
import { RegisterSchema } from '@/schemas';
import { register } from '../../server/actions';
import { useState, useTransition } from 'react';
import { MessageSquareWarningIcon } from 'lucide-react';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { signIn } from 'next-auth/react';
import SocialSignIn from './social-signin';

export function RegisterForm() {
	// Error State
	const [error, setError] = useState('');
	// shadcn form
	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: '',
			password: '',
			name: '',
			lastName: '',
			confirmPassword: '',
		},
	});

	// Form Status
	const [pending, startTransition] = useTransition();

	// Server Action Call
	const handleSubmit = (values: z.infer<typeof RegisterSchema>) => {
		startTransition(() =>
			register(values).then((data) => {
				if (data?.error) setError(data.error);
			})
		);
	};

	return (
		<Card className='w-[min(calc(100%),450px)] mx-auto rounded-none sm:rounded-md'>
			<CardHeader>
				<CardTitle>Register</CardTitle>
				<CardDescription className='tracking-tighter'>
					The obedient will be the rewarded
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<div className='grid w-full items-center gap-4'>
							<div className='flex gap-2 flex-wrap'>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem className='flex-grow'>
											<FormLabel htmlFor='name'>Name</FormLabel>
											<FormControl>
												<Input {...field} aria-disabled={pending} disabled={pending} />
											</FormControl>
											<FormMessage className='text-xs' />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='lastName'
									render={({ field }) => (
										<FormItem className='flex-grow'>
											<FormLabel htmlFor='lastName'>Last Name</FormLabel>
											<FormControl>
												<Input {...field} aria-disabled={pending} disabled={pending} />
											</FormControl>
											<FormMessage className='text-xs' />
										</FormItem>
									)}
								/>
							</div>
							<div className='flex flex-col space-y-1.5'>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor='email'>Email</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder='the.obedient@sealteam.com'
													aria-disabled={pending}
													disabled={pending}
												/>
											</FormControl>
											<FormMessage className='text-xs' />
										</FormItem>
									)}
								/>
							</div>
							<div className='flex flex-col space-y-1.5'>
								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor='password'>Password</FormLabel>
											<FormControl>
												<Input
													{...field}
													type='password'
													aria-disabled={pending}
													disabled={pending}
												/>
											</FormControl>
											<FormMessage className='text-xs' />
										</FormItem>
									)}
								/>
							</div>
							<div className='flex flex-col space-y-1.5'>
								<FormField
									control={form.control}
									name='confirmPassword'
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor='confirmPassword'>Confirm Password</FormLabel>
											<FormControl>
												<Input
													{...field}
													type='password'
													aria-disabled={pending}
													disabled={pending}
												/>
											</FormControl>
											<FormMessage className='text-xs' />
										</FormItem>
									)}
								/>
							</div>

							{error && (
								<div className='px-3 py-2 w-full text-xs bg-red-500/15 text-red-500 rounded-md flex items-center gap-2'>
									<MessageSquareWarningIcon size={12} /> {error}
								</div>
							)}
							<div className='flex justify-center pt-3'>
								<Button className='w-1/2' aria-disabled={pending} disabled={pending}>
									Register
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</CardContent>
			<CardFooter className='text-center flex flex-col space-y-4'>
				<SocialSignIn />
				<Link href={'/auth/login'} className='text-xs hover:text-muted-foreground'>
					Already have an account?
				</Link>
			</CardFooter>
		</Card>
	);
}
