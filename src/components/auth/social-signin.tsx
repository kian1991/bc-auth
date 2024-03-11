'use client';

import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react';
import { signIn } from 'next-auth/react'; // Weil Client Component
import { Button } from '../ui/button';

export default function SocialSignIn() {
	// Social Signin handler
	const handleSocialSignIn = (provider: 'google' | 'github') => {
		signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
	};

	return (
		<div className='flex items-center space-x-4 py-4'>
			<Button
				variant={'outline'}
				onClick={() => handleSocialSignIn('google')}
				className='rounded-full'>
				<IconBrandGoogle size={18} />
			</Button>
			<Button onClick={() => handleSocialSignIn('github')} className='rounded-full'>
				<IconBrandGithub size={18} />
			</Button>
		</div>
	);
}
