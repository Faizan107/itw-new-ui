import * as React from 'react';

function SvgEmojiFoodBeverage(props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			height='1em'
			viewBox='0 0 24 24'
			width='1em'
			className='svg-icon'
			{...props}>
			<path fill='none' d='M0 0h24v24H0z' />
			<path
				d='M10 6.4l1.81 1.45c.12.09.19.24.19.39v4.26c0 .28-.22.5-.5.5h-4c-.28 0-.5-.22-.5-.5V8.24c0-.15.07-.3.19-.39L9 6.4V5H6v8c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V5h-6v1.4z'
				opacity={0.3}
			/>
			<path d='M2 19h18v2H2zM20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zM9.5 7.28l1.5 1.2V12H8V8.48l1.5-1.2zM16 13c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V5h3v1.4L7.19 7.85c-.12.09-.19.24-.19.39v4.26c0 .28.22.5.5.5h4c.28 0 .5-.22.5-.5V8.24c0-.15-.07-.3-.19-.39L10 6.4V5h6v8zm4-5h-2V5h2v3z' />
		</svg>
	);
}

export default SvgEmojiFoodBeverage;
