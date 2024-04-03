import type { ComponentProps } from "react";
import clsx from "clsx";

export function TableHeader({ className, ...props }: ComponentProps<"th">) {
	return <th {...props} className={clsx("py-3 px-4 font-semibold", className)} />;
}
