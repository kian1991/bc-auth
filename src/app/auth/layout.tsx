import { db } from '@/lib/db';
import { PrismaClient } from '@prisma/client';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
	const user = new PrismaClient();
	return <main className='h-full flex justify-center items-center'>{children}</main>;
}
