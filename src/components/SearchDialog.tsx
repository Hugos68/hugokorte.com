import {
	type Accessor,
	For,
	type Setter,
	Show,
	Suspense,
	createEffect,
	createMemo,
	createResource,
	createSignal,
	onCleanup,
} from "solid-js";
import type { Pagefind } from "vite-plugin-pagefind/types";

interface Props {
	open: Accessor<boolean>;
	onOpenChange: Setter<boolean>;
}

let pagefind: Pagefind;

async function search(query: string) {
	if (query === "") {
		return [];
	}
	if (!pagefind) {
		// @ts-expect-error - Present at build time
		pagefind = await import("/pagefind/pagefind.js");
		await pagefind.init();
	}
	const result = await pagefind.search(query);
	if (!result) {
		return [];
	}
	return await Promise.all(result.results.map((result) => result.data()));
}

export default function (props: Props) {
	const [dialog, setDialog] = createSignal<HTMLDialogElement>();
	const [query, setQuery] = createSignal("");
	const searching = createMemo(() => query() !== "");
	const [searchResults] = createResource(query, search);
	createEffect(() =>
		props.open() ? dialog()?.showModal() : dialog()?.close(),
	);
	function onClick(event: MouseEvent) {
		if (
			!(
				event.target &&
				event.target instanceof HTMLDialogElement &&
				event.target.tagName === "DIALOG"
			)
		) {
			return;
		}
		const rect = event.target.getBoundingClientRect();
		const insideDialog =
			rect.top <= event.clientY &&
			event.clientY <= rect.top + rect.height &&
			rect.left <= event.clientX &&
			event.clientX <= rect.left + rect.width;
		if (insideDialog) {
			return;
		}
		event.target.close();
	}
	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: This action is not applicable to keyboard input
		<dialog
			onClick={onClick}
			onClose={() => props.onOpenChange(false)}
			class="fixed top-1/5 left-1/2 -translate-x-1/2 backdrop:bg-black/50 w-[90dvw] max-w-4xl max-h-[75dvh]"
			ref={setDialog}
		>
			<div class="bg-neutral-100 dark:bg-neutral-900 grid">
				<input
					class="bg-neutral-100 dark:bg-neutral-900 p-4"
					type="search"
					placeholder="Search..."
					value={query()}
					onInput={(e) => setQuery(e.currentTarget.value)}
				/>
				<div class="px-4 py-8 overflow-auto">
					<Show
						when={searching()}
						fallback={
							<p class="text-center text-neutral-500 text-sm">
								Type anything to search...
							</p>
						}
					>
						<ul class="grid gap-2">
							<Suspense
								fallback={
									<p class="text-center text-neutral-500 text-sm">
										Searching...
									</p>
								}
							>
								<Show
									when={(searchResults() ?? []).length > 0}
									fallback={
										<p class="text-center text-neutral-500 text-sm">
											No results found for query: {query()}
										</p>
									}
								>
									<For each={searchResults()}>
										{(item) => {
											return (
												<li>
													<a
														class="p-4 bg-neutral-200 dark:bg-neutral-800 grid gap-1"
														href={item.url}
													>
														<span class="text-lg font-semibold">
															{item.meta.title}
														</span>
														<span
															class="[&>mark]:bg-neutral-500 [&>mark]:px-1"
															innerHTML={item.excerpt}
														/>
													</a>
												</li>
											);
										}}
									</For>
								</Show>
							</Suspense>
						</ul>
					</Show>
				</div>
			</div>
		</dialog>
	);
}
