import { APP_NAME, BASE_URL, MAIL_ADDRESSES } from '@/constants';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `${BASE_URL}/auth/new-verification?token=${token}`;

	await resend.emails.send({
		from: MAIL_ADDRESSES.VERIFY,
		to: email,
		subject: `🔓 Verify your email at ${APP_NAME}`,
		html: `
            <h1>Verify your email</h1>
            <p>Click the link below to verify your email</p>
            <a href="${confirmLink}">${confirmLink}</a>
        `,
	});
};
