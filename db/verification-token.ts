import { db } from './prisma-client';

export const getVerificationTokenbyEmail = async (email: string) => {
	try {
		return await db.verificationToken.findFirst({
			where: {
				email,
			},
		});
	} catch (error) {
		return null;
	}
};
export const getVerificationTokenbyToken = async (token: string) => {
	try {
		return await db.verificationToken.findUnique({
			where: {
				token,
			},
		});
	} catch (error) {
		return null;
	}
};
