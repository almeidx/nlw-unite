import type { ComponentProps } from "react";
import clsx from "clsx";

export function TableCell({ className, ...props }: ComponentProps<"td">) {
	return <td {...props} className={clsx("py-3 px-4", className)} />;
}
