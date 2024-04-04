import { Type, type TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";

const perPage = 10;

export async function getEventAttendees(app: FastifyInstance) {
	app.withTypeProvider<TypeBoxTypeProvider>().get(
		"/events/:eventId/attendees",
		{
			schema: {
				summary: "Get attendees for an event",
				tags: ["events"],
				params: Type.Object({
					eventId: Type.String({ format: "uuid" }),
				}),
				querystring: Type.Object({
					pageIndex: Type.Integer({ minimum: 0, default: 0 }),
					query: Type.Optional(Type.String()),
				}),
				response: {
					200: Type.Object({
						attendees: Type.Array(
							Type.Object({
								id: Type.Integer(),
								name: Type.String(),
								email: Type.String({ format: "email" }),
								createdAt: Type.String({ format: "date-time" }),
								checkedInAt: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
							}),
						),
						total: Type.Integer(),
					}),
				},
			},
		},
		async (request) => {
			const { eventId } = request.params;
			const { pageIndex, query } = request.query;

			const where = query ? { eventId, name: { contains: query } } : { eventId };

			const [attendees, total] = await Promise.all([
				prisma.attendee.findMany({
					select: {
						id: true,
						name: true,
						email: true,
						createdAt: true,

						checkIn: {
							select: {
								createdAt: true,
							},
						},
					},
					where,
					take: perPage,
					skip: pageIndex * perPage,
					orderBy: {
						createdAt: "desc",
					},
				}),
				prisma.attendee.count({ where }),
			]);

			return {
				attendees: attendees.map((attendee) => ({
					id: attendee.id,
					name: attendee.name,
					email: attendee.email,
					createdAt: attendee.createdAt.toISOString(),
					checkedInAt: attendee.checkIn?.createdAt.toISOString() ?? null,
				})),
				total,
			};
		},
	);
}
