import {
	children,
	createSignal,
	onMount,
	type ParentProps
} from 'solid-js';
import SearchDialog from './SearchDialog.tsx';

export default function(props: ParentProps) {
	const c = children(() => props.children);
	const [open, setOpen] = createSignal(false);
	onMount(() => {
		const controller = new AbortController();
		document.addEventListener('keydown', (e) => {
			if (!(e.ctrlKey && e.key === 'k')) {
				return;
			}
			e.preventDefault();
			setOpen((open) => !open);
		}, { signal: controller.signal });
		return () => controller.abort();
	});
	return (
		<>
			<button onClick={() => setOpen(true)}>{c()}</button>
			<SearchDialog open={open} onOpenChange={setOpen}></SearchDialog>
		</>
	)
}