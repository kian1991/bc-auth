import { Button, Container, Html, Tailwind } from '@react-email/components';
import * as React from 'react';

export function WelcomeEmail({ name }: { name: string }) {
	return (
		<Html
			style={{
				fontFamily: 'system-ui',
			}}>
			<Tailwind>
				<Container>
					<p>Hey {name}!</p>
					<Button
						className='bg-teal-600 rounded-md'
						href='https://example.com'
						style={{ background: '#000', color: '#fff', padding: '12px 20px' }}>
						Click me
					</Button>
				</Container>
			</Tailwind>
		</Html>
	);
}
