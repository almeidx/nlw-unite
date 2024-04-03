import { Search, MoreHorizontal, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { IconButton } from "./icon-button.tsx";
import { Table } from "./table/table.tsx";
import { TableHeader } from "./table/table-header.tsx";
import { TableCell } from "./table/table-cell.tsx";
import { TableRow } from "./table/table-row.tsx";
import { useState, type ChangeEvent } from "react";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";

// biome-ignore format: Don't want to format this generated array
const attendees = [
  { id: 1, name: "Jane Doe", email: "jane.doe@example.com", createdAt: new Date('2022-01-01'), checkedInAt: new Date('2022-01-02') },
  { id: 2, name: "Bob Smith", email: "bob.smith@example.com", createdAt: new Date('2022-01-03'), checkedInAt: new Date('2022-01-04') },
  { id: 3, name: "Alice Johnson", email: "alice.johnson@example.com", createdAt: new Date('2022-01-05'), checkedInAt: new Date('2022-01-06') },
  { id: 4, name: "Charlie Brown", email: "charlie.brown@example.com", createdAt: new Date('2022-01-07'), checkedInAt: new Date('2022-01-08') },
  { id: 5, name: "David Williams", email: "david.williams@example.com", createdAt: new Date('2022-01-09'), checkedInAt: new Date('2022-01-10') },
  { id: 6, name: "Eve Martin", email: "eve.martin@example.com", createdAt: new Date('2022-01-11'), checkedInAt: new Date('2022-01-12') },
  { id: 7, name: "Frank Thompson", email: "frank.thompson@example.com", createdAt: new Date('2022-01-13'), checkedInAt: new Date('2022-01-14') },
  { id: 8, name: "Grace Lee", email: "grace.lee@example.com", createdAt: new Date('2022-01-15'), checkedInAt: new Date('2022-01-16') },
  { id: 9, name: "Harry Wilson", email: "harry.wilson@example.com", createdAt: new Date('2022-01-17'), checkedInAt: new Date('2022-01-18') },
  { id: 10, name: "Ivy Davis", email: "ivy.davis@example.com", createdAt: new Date('2022-01-19'), checkedInAt: new Date('2022-01-20') },
	{ id: 11, name: "Jack Anderson", email: "jack.anderson@example.com", createdAt: new Date('2022-01-21'), checkedInAt: new Date('2022-01-22') },
  { id: 12, name: "Kelly Rodriguez", email: "kelly.rodriguez@example.com", createdAt: new Date('2022-01-23'), checkedInAt: new Date('2022-01-24') },
  { id: 13, name: "Liam Martinez", email: "liam.martinez@example.com", createdAt: new Date('2022-01-25'), checkedInAt: new Date('2022-01-26') },
  { id: 14, name: "Mia Hernandez", email: "mia.hernandez@example.com", createdAt: new Date('2022-01-27'), checkedInAt: new Date('2022-01-28') },
  { id: 15, name: "Noah Lopez", email: "noah.lopez@example.com", createdAt: new Date('2022-01-29'), checkedInAt: new Date('2022-01-30') },
];

const perPage = 10;

export function AttendeeList() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);

	const lastPage = Math.ceil(attendees.length / perPage);

	function onSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
		setSearch(event.target.value);
	}

	return (
		<div className="space-y-4">
			<div className="flex gap-3 items-center">
				<h1 className="text-2xl font-bold">Participantes</h1>

				<div className="px-3 py-1.5 w-72 border border-white/10 rounded-lg flex items-center gap-3">
					<Search className="size-4 text-emerald-300" />
					<input
						className="bg-transparent flex-1 outline-none border-0 p-0 text-sm"
						placeholder="Pesquisar participante..."
						onChange={onSearchInputChange}
						value={search}
					/>
				</div>
			</div>

			<Table>
				<thead>
					<tr className="border-b border-white/10 text-sm text-left">
						<TableHeader>
							<input
								className="size-4 bg-black/20 rounded border border-white/10 checked:text-orange-400"
								type="checkbox"
							/>
						</TableHeader>
						<TableHeader className="w-12">Código</TableHeader>
						<TableHeader>Participante</TableHeader>
						<TableHeader>Data de inscrição</TableHeader>
						<TableHeader>Data de check-in</TableHeader>
						<TableHeader className="w-16" />
					</tr>
				</thead>

				<tbody>
					{attendees.slice((page - 1) * perPage, page * perPage).map((attendee) => (
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
							<TableCell>{formatDistanceToNow(attendee.createdAt, { locale: pt })}</TableCell>
							<TableCell>{formatDistanceToNow(attendee.checkedInAt, { locale: pt })}</TableCell>
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
							A mostrar {perPage} de {attendees.length} items
						</TableCell>
						<TableCell className="text-right" colSpan={3}>
							<div className="inline-flex items-center gap-8">
								<span>
									Página {page} de {lastPage}
								</span>

								<div className="space-x-1.5">
									<IconButton onClick={() => setPage(1)} disabled={page === 1}>
										<ChevronsLeft className="size-4" />
									</IconButton>
									<IconButton onClick={() => setPage((page) => page - 1)} disabled={page === 1}>
										<ChevronLeft className="size-4" />
									</IconButton>
									<IconButton onClick={() => setPage((page) => page + 1)} disabled={page === lastPage}>
										<ChevronRight className="size-4" />
									</IconButton>
									<IconButton onClick={() => setPage(lastPage)} disabled={page === lastPage}>
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
