import { Type, type TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";

export async function getEvent(app: FastifyInstance) {
	app.withTypeProvider<TypeBoxTypeProvider>().get(
		"/events/:eventId",
		{
			schema: {
				params: Type.Object({
					eventId: Type.String({ format: "uuid" }),
				}),
				response: {
					200: Type.Object({
						event: Type.Object({
							id: Type.String({ format: "uuid" }),
							title: Type.String(),
							details: Type.Union([Type.String(), Type.Null()]),
							slug: Type.String(),
							maximumAttendees: Type.Union([Type.Integer(), Type.Null()]),
							attendeeCount: Type.Integer({ minimum: 1 }),
						}),
					}),
				},
			},
		},
		async (request) => {
			const { eventId } = request.params;

			const event = await prisma.event.findUnique({
				select: {
					_count: {
						select: {
							attendees: true,
						},
					},
					id: true,
					title: true,
					slug: true,
					details: true,
					maximumAttendees: true,
				},
				where: { id: eventId },
			});

			if (!event) {
				throw app.httpErrors.notFound("Event not found");
			}

			const { _count, ...eventData } = event;

			return {
				event: {
					...eventData,
					attendeeCount: _count.attendees,
				},
			};
		},
	);
}
