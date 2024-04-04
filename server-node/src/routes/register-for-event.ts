import { Type, type TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";

export async function registerForEvent(app: FastifyInstance) {
	app.withTypeProvider<TypeBoxTypeProvider>().post(
		"/events/:eventId/attendees",
		{
			schema: {
				summary: "Register for an event",
				tags: ["events"],
				body: Type.Object({
					name: Type.String({ minLength: 4 }),
					email: Type.String({ format: "email" }),
				}),
				params: Type.Object({
					eventId: Type.String({ format: "uuid" }),
				}),
				response: {
					201: Type.Object({
						attendeeId: Type.Integer({ minimum: 1 }),
					}),
				},
			},
		},
		async (request, reply) => {
			const { eventId } = request.params;
			const { name, email } = request.body;

			const event = await prisma.event.findUnique({
				select: { id: true, maximumAttendees: true },
				where: { id: eventId },
			});

			if (!event) {
				throw app.httpErrors.notFound("Event not found");
			}

			const attendeeFromEmail = await prisma.attendee.findUnique({
				where: { eventId_email: { email, eventId } },
				select: { id: true },
			});

			if (attendeeFromEmail) {
				throw app.httpErrors.conflict("Attendee already registered for this event");
			}

			if (event.maximumAttendees) {
				const attendeeCount = await prisma.attendee.count({
					where: { eventId },
				});

				if (attendeeCount >= event.maximumAttendees) {
					throw app.httpErrors.conflict("Event is full");
				}
			}

			const attendee = await prisma.attendee.create({
				data: { name, email, eventId },
				select: { id: true },
			});

			reply.statusCode = 201;
			return { attendeeId: attendee.id };
		},
	);
}
