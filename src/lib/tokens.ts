import { v4 as uuidv4 } from 'uuid';
import { db } from '../../db/prisma-client';
import { getVerificationTokenbyEmail } from '../../db/verification-token';

export const generateVerificationToken = async (email: string) => {
	const token = uuidv4();
	// let the token expire in 1 hour
	const expiresAt = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour
	//check for existing token
	const existingToken = await getVerificationTokenbyEmail(email);

	if (existingToken) {
		// we delete the existing token
		await db.verificationToken.delete({
			where: {
				id: existingToken.id,
			},
		});
	}

	// and create a new one
	const verificationToken = await db.verificationToken.create({
		data: {
			token,
			expiresAt,
			email,
		},
	});

	// return the token
	return verificationToken;
};
