import {
	createEffect,
	createSignal,
	type Accessor,
	type Setter,
	createResource,
	Suspense,
	For
} from 'solid-js';
import type { Pagefind } from 'vite-plugin-pagefind/types';

interface Props {
	open: Accessor<boolean>;
	onOpenChange: Setter<boolean>;
}

let pagefind: Pagefind;

async function search(query: string) {
	if (query === '') {
		return [];
	}
	if (!pagefind) {
		// @ts-expect-error - Present at build time
		pagefind = await import('/pagefind/pagefind.js');
		await pagefind.init();
	}
	const result = await pagefind.debouncedSearch(query, {}, 200);
	if (!result) {
		return [];
	}
	return await Promise.all(result.results.map((result) => result.data()));
}

export default function(props: Props) {
	const [dialog, setDialog] = createSignal<HTMLDialogElement>();
	const [query, setQuery] = createSignal("");
	const [searchResults] = createResource(query, search);
	createEffect(() => props.open() ? dialog()?.showModal() : dialog()?.close());
	return (
		<dialog
			onClose={() => props.onOpenChange(false)}
			class="fixed top-1/3 left-1/2 -translate-1/2 backdrop:bg-black/50"
			ref={setDialog}
		>
			<input
				type="search"
				placeholder="Search..."
				value={query()}
				onInput={(e) => setQuery(e.currentTarget.value)}
			/>
			<ul>
				<Suspense fallback={<p>Loading...</p>}>
					<For each={searchResults()}>
						{(item) => {
							return (
								<li>
									<a href={item.url}>{item.content}</a>
								</li>
							)
						}}
					</For>
			</Suspense>
			</ul>
		</dialog>
	)
}