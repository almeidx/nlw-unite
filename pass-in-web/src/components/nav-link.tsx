import type { ComponentProps } from "react";

export function NavLink(props: NavLinkProps) {
	return <a className="text-zinc-300" {...props} />;
}

interface NavLinkProps extends Omit<ComponentProps<"a">, "className"> {}
