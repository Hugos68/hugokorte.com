import type { MarkdownHeading } from "astro";
import { For } from "solid-js";

interface Props {
	headings: MarkdownHeading[];
}

function getLeftMargin(depth: number) {
	switch (depth) {
		case 3:
			return "ml-2";
		case 4:
			return "ml-4";
		case 5:
			return "ml-6";
		case 6:
			return "ml-8";
		default:
			return "";
	}
}

function getTextSize(depth: number) {
	switch (depth) {
		case 2:
			return "text-lg";
		case 3:
			return "text-md";
		case 4:
			return "text-sm";
		case 5:
			return "text-xs";
		case 6:
			return "text-xs";
		default:
			return "";
	}
}

export default function (props: Props) {
	return (
		<nav>
			<ul>
				<For each={props.headings}>
					{(heading) => (
						<li
							class={`${getLeftMargin(heading.depth)} ${getTextSize(heading.depth)}`}
						>
							<a href={`#${heading.slug}`}>{heading.text}</a>
						</li>
					)}
				</For>
			</ul>
		</nav>
	);
}
