'use client';

import { useRouter } from 'next/navigation';

interface Props {
	children: React.ReactNode;
	mode?: 'modal' | 'redirect';
	asChild?: boolean;
}

export default function LoginButton({ children, mode = 'redirect', asChild }: Props) {
	const router = useRouter();

	const clickHandler = () => {
		router.push('/auth/login');
	};

	if (mode === 'modal') {
		return <span>TO BE IMPLEMENTED...(Later)</span>;
	}

	return (
		<span className='cursor-pointer' onClick={clickHandler}>
			{children}
		</span>
	);
}
