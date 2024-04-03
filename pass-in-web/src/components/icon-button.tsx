import type { ComponentProps } from "react";
import clsx from "clsx";

export function IconButton({ transparent, ...props }: IconButtonProps) {
	return (
		<button
			className={clsx(
				"border border-white/10 rounded-md p-1.5 disabled:opacity-50",
				transparent ? "bg-black/20" : "bg-white/10",
			)}
			{...props}
		/>
	);
}

interface IconButtonProps extends Omit<ComponentProps<"button">, "className"> {
	transparent?: boolean;
}
