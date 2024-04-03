import nlwUniteSvg from "../assets/nlw-unite.svg";
import { NavLink } from "./nav-link.tsx";

export function Header() {
	return (
		<div className="flex items-center gap-5">
			<img src={nlwUniteSvg} alt="Next Level Week - Unite icon" />

			<nav className="flex items-center gap-5 font-medium text-sm">
				<NavLink href="/events">Eventos</NavLink>
				<NavLink href="/participants">Participantes</NavLink>
			</nav>
		</div>
	);
}
