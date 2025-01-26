import { children } from 'solid-js';

export default function(props) {
	const c = children(() => props.children);
	return <button onClick={() => console.log('Click')}>{c()}</button>
}