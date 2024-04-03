import type { PropsWithChildren } from "react";

export function Table({ children }: PropsWithChildren) {
	return (
		<div className="border border-white/10 rounded-lg">
			<table className="w-full">{children}</table>
		</div>
	);
}
