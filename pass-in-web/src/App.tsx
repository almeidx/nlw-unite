import { AttendeeList } from "./components/attendee-list.tsx";
import { Header } from "./components/header.tsx";

export function App() {
	return (
		<div className="max-w-[1216px] mx-auto py-5 space-y-5">
			<Header />
			<AttendeeList />
		</div>
	);
}
