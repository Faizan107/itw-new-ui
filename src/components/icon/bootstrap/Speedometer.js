import * as React from 'react';

function SvgSpeedometer(props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='1em'
			height='1em'
			fill='currentColor'
			className='svg-icon'
			viewBox='0 0 16 16'
			{...props}>
			<path d='M8 2a.5.5 0 01.5.5V4a.5.5 0 01-1 0V2.5A.5.5 0 018 2zM3.732 3.732a.5.5 0 01.707 0l.915.914a.5.5 0 11-.708.708l-.914-.915a.5.5 0 010-.707zM2 8a.5.5 0 01.5-.5h1.586a.5.5 0 010 1H2.5A.5.5 0 012 8zm9.5 0a.5.5 0 01.5-.5h1.5a.5.5 0 010 1H12a.5.5 0 01-.5-.5zm.754-4.246a.389.389 0 00-.527-.02L7.547 7.31A.91.91 0 108.85 8.569l3.434-4.297a.389.389 0 00-.029-.518z' />
			<path
				fillRule='evenodd'
				d='M6.664 15.889A8 8 0 119.336.11a8 8 0 01-2.672 15.78zm-4.665-4.283A11.945 11.945 0 018 10c2.186 0 4.236.585 6.001 1.606a7 7 0 10-12.002 0z'
			/>
		</svg>
	);
}

export default SvgSpeedometer;
