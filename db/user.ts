import { User } from '@prisma/client';
import { db } from './prisma-client';

export const getUserById = async (id: string): Promise<User | null> => {
	try {
		return await db.user.findUnique({ where: { id } });
	} catch (error) {
		return null;
	}
};
export const getUserByEmail = async (email: string): Promise<User | null> => {
	try {
		return await db.user.findUnique({ where: { email } });
	} catch (error) {
		return null;
	}
};
