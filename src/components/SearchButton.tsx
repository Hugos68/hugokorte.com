import { children, createSignal, type ParentProps } from 'solid-js';
import SearchDialog from './SearchDialog.tsx';

export default function(props: ParentProps) {
	const c = children(() => props.children);
	const [open, setOpen] = createSignal(false);

	return (
		<>
			<button onClick={() => setOpen(true)}>{c()}</button>
			<SearchDialog open={open} onOpenChange={setOpen}></SearchDialog>
		</>
	)
}