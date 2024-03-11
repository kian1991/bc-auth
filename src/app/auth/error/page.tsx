import ErrorMessage from '@/components/error-message';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import Link from 'next/link';

interface ErrorCardProps {
	searchParams: {
		error: string;
	};
}

export default function ErrorPage({ searchParams }: ErrorCardProps) {
	const { error } = searchParams;
	return (
		<Card className='text-center'>
			<CardHeader>
				<CardTitle>Oh Snap :(</CardTitle>
				<CardDescription className='tracking-tighter'>
					There was an error processing your request
				</CardDescription>
			</CardHeader>
			<CardContent>
				{error && <ErrorMessage message={error} className='justify-center' />}
			</CardContent>
			<CardFooter>
				<CardFooter className='flex w-full justify-center'>
					<Link href={'/'} className='text-xs hover:text-muted-foreground'>
						Back
					</Link>
				</CardFooter>
			</CardFooter>
		</Card>
	);
}
