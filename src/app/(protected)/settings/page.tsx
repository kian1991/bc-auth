import { auth, signOut } from '@/auth';
import { Button } from '@/components/ui/button';

export default async function SettingsPage() {
	const session = await auth();

	return <textarea value={JSON.stringify(session, null, 2)} rows={30} cols={90} />;
	// return (
	// 	<div className='h-full grid place-items-center '>
	// 		<div className='flex flex-col gap-2'>
	// 			<h1 className='font-bold text-3xl tracking-tighter'>Settings</h1>
	// 			<div className='flex gap-x-3 items-center'>
	// 				Name:
	// 				<span className='px-2 text-sm py-0.5 bg-gray-500/15 text-gray-500 rounded-lg'>
	// 					{session?.user?.name}
	// 				</span>
	// 			</div>
	// 			<div className='flex gap-x-3 items-center'>
	// 				Email:
	// 				<span className='px-2 text-sm py-0.5 bg-gray-500/15 text-gray-500 rounded-lg'>
	// 					{session?.user?.email}
	// 				</span>
	// 			</div>
	// 			<form
	// 				action={async () => {
	// 					'use server';
	// 					await signOut();
	// 				}}>
	// 				<Button>Sign Out</Button>
	// 			</form>
	// 			<p>{JSON.stringify(session?.user, null, 2)}</p>
	// 		</div>
	// 	</div>
	// );
}
