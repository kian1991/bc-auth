import { auth } from '@/auth';
import LoginButton from '@/components/auth/login-button';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Home() {
	const session = await auth();
	return (
		<main className='flex flex-col gap-6 items-center justify-center h-full'>
			<h1 className='text-4xl drop-shadow-md'>Welcome to the void.</h1>

			{session ? (
				<Button>
					<Link href={'/settings'}>SETTINGS</Link>
				</Button>
			) : (
				<LoginButton>
					<Button>ENTER</Button>
				</LoginButton>
			)}
		</main>
	);
}
