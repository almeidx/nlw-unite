import type { ComponentProps } from "react";
import clsx from "clsx";

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
	return (
		<tr {...props} className={clsx("border-b border-white/10 text-sm text-zinc-300 hover:bg-white/5", className)} />
	);
}
