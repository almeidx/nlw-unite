import { Search, MoreHorizontal, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { IconButton } from "./icon-button.tsx";
import { Table } from "./table/table.tsx";
import { TableHeader } from "./table/table-header.tsx";
import { TableCell } from "./table/table-cell.tsx";
import { TableRow } from "./table/table-row.tsx";
import { useEffect, useState, type ChangeEvent } from "react";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { API_URL } from "../lib/api.ts";

const perPage = 10;

export function AttendeeList() {
	const [search, setSearch] = useState(() => {
		const searchParams = new URLSearchParams(window.location.search);
		return searchParams.get("query") || "";
	});
	const [page, setPage] = useState(() => {
		const searchParams = new URLSearchParams(window.location.search);
		return Number(searchParams.get("page")) || 1;
	});
	const [total, setTotal] = useState(0);
	const [attendees, setAttendees] = useState<Attendee[]>([]);

	useEffect(() => {
		const searchParams = new URLSearchParams({ pageIndex: String(page - 1) });
		if (search) searchParams.set("query", search);

		fetch(`${API_URL}/events/6e21db30-6e09-433e-8d14-25d42c119612/attendees?${searchParams.toString()}`)
			.then((response) => response.json())
			.then((data) => {
				setAttendees(data.attendees);
				setTotal(data.total);
			});
	}, [page, search]);

	const lastPage = Math.ceil(total / perPage);

	function onSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
		setSearch(event.target.value);
		setPage(1);

		const url = new URL(window.location.toString());
		url.searchParams.set("query", search);
		url.searchParams.set("pageIndex", "0");
		window.history.pushState({}, "", url.toString());
	}

	function setCurrentPage(page: number) {
		setPage(page);

		const url = new URL(window.location.toString());
		url.searchParams.set("pageIndex", String(lastPage - 1));
		window.history.pushState({}, "", url.toString());
	}

	return (
		<div className="space-y-4">
			<div className="flex gap-3 items-center">
				<h1 className="text-2xl font-bold">Participantes</h1>

				<div className="px-3 py-1.5 w-72 border border-white/10 rounded-lg flex items-center gap-3">
					<Search className="size-4 text-emerald-300" />
					<input
						className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
						placeholder="Pesquisar participante..."
						onChange={onSearchInputChange}
						value={search}
					/>
				</div>
			</div>

			<Table>
				<thead>
					<tr className="border-b border-white/10 text-sm text-left">
						<TableHeader className="w-12">
							<input
								className="size-4 bg-black/20 rounded border border-white/10 checked:text-orange-400"
								type="checkbox"
							/>
						</TableHeader>
						<TableHeader>Código</TableHeader>
						<TableHeader>Participante</TableHeader>
						<TableHeader>Data de inscrição</TableHeader>
						<TableHeader>Data de check-in</TableHeader>
						<TableHeader className="w-16" />
					</tr>
				</thead>

				<tbody>
					{attendees.map((attendee) => (
						<TableRow key={attendee.id}>
							<TableCell>
								<input
									className="size-4 bg-black/20 rounded border border-white/10 checked:text-orange-400"
									type="checkbox"
								/>
							</TableCell>
							<TableCell>{attendee.id}</TableCell>
							<TableCell>
								<div className="flex flex-col gap-1">
									<span className="font-semibold text-white">{attendee.name}</span>
									<span>{attendee.email}</span>
								</div>
							</TableCell>
							<TableCell>{formatDistanceToNow(attendee.createdAt, { locale: pt, addSuffix: true })}</TableCell>
							<TableCell>
								{attendee.checkedInAt ? (
									formatDistanceToNow(attendee.checkedInAt, { locale: pt, addSuffix: true })
								) : (
									<span className="text-zinc-400">Sem check-in</span>
								)}
							</TableCell>
							<TableCell>
								<IconButton transparent>
									<MoreHorizontal className="size-4" />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
				</tbody>

				<tfoot>
					<tr className="text-sm text-zinc-300">
						<TableCell colSpan={3}>
							A mostrar {attendees.length} de {total} items
						</TableCell>
						<TableCell className="text-right" colSpan={3}>
							<div className="inline-flex items-center gap-8">
								<span>
									Página {page} de {lastPage}
								</span>

								<div className="space-x-1.5">
									<IconButton onClick={() => setCurrentPage(1)} disabled={page === 1}>
										<ChevronsLeft className="size-4" />
									</IconButton>
									<IconButton onClick={() => setCurrentPage(page - 1)} disabled={page === 1}>
										<ChevronLeft className="size-4" />
									</IconButton>
									<IconButton onClick={() => setCurrentPage(page + 1)} disabled={page === lastPage}>
										<ChevronRight className="size-4" />
									</IconButton>
									<IconButton onClick={() => setCurrentPage(lastPage)} disabled={page === lastPage}>
										<ChevronsRight className="size-4" />
									</IconButton>
								</div>
							</div>
						</TableCell>
					</tr>
				</tfoot>
			</Table>
		</div>
	);
}

interface Attendee {
	id: number;
	name: string;
	email: string;
	createdAt: string;
	checkedInAt: string | null;
}
