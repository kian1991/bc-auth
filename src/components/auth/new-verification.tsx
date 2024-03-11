'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '../ui/card';
import { PropagateLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation';
import { newVerification } from '@/server/actions';
import ErrorMessage from '../error-message';
import Success from '../success-message';
import Link from 'next/link';

export default function NewVerification() {
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();

	const searchParams = useSearchParams();

	const token = searchParams.get('token');

	const onSubmit = useCallback(() => {
		if (!token) {
			setError('Missing token!');
			return;
		}

		newVerification(token)
			.then((data) => {
				setSuccess(data.success);
				setError(data.error);
			})
			.catch(() => {
				setError('Something went wrong!');
			});
	}, [token]);

	useEffect(() => {
		onSubmit();
	}, [onSubmit]);

	return (
		<Card className='mx-auto rounded-none sm:rounded-md w-[350px] text-center'>
			<CardHeader>
				<CardTitle>Verification</CardTitle>
				<CardDescription className='tracking-tighter'>
					We&apos;re verifying your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='w-full grid place-items-center py-9'>
					<Success message={success} className='justify-center' />
					{!success && <ErrorMessage message={error} className='justify-center' />}
					{!error && !success && <PropagateLoader />}
				</div>
			</CardContent>
			<CardFooter className='text-center flex flex-col space-y-4'>
				<Link href={'/auth/login'} className='text-xs hover:text-muted-foreground'>
					Back to Login
				</Link>
			</CardFooter>
		</Card>
	);
}
