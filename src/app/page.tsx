import LoginButton from '@/components/auth/login-button';
import { Button } from '@/components/ui/button';

export default function Home() {
	return (
		<main className='flex flex-col gap-6 items-center justify-center h-full'>
			<h1 className='text-4xl drop-shadow-md'>Welcome to the void.</h1>
			<LoginButton>
				<Button>ENTER</Button>
			</LoginButton>
		</main>
	);
}
