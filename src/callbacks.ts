callbacks: {
		session: async ({ token, session }) => {
			if (token.role && token.lastName && session.user) {
				session.user.lastName = token.lastName as string;
				session.user.role = token.role as UserRole;
			}
			console.log('session', session);
			return session;
		},
		jwt: async ({ token }) => {
			if (!token.sub) return token;
			const user = await getUserById(token.sub);
			if (!user) return token;
			token.lastName = user.lastName;
			token.role = user.role;
			console.log('token', token);
			return token;
		},
	},