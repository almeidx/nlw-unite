import { Type, type TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";

export async function getAttendeeBadge(app: FastifyInstance) {
	app.withTypeProvider<TypeBoxTypeProvider>().get(
		"/attendees/:attendeeId/badge",
		{
			schema: {
				summary: "Get a badge for an attendee",
				tags: ["attendees"],
				params: Type.Object({
					attendeeId: Type.Integer({ minimum: 1 }),
				}),
				response: {
					200: Type.Object({
						badge: Type.Object({
							name: Type.String(),
							email: Type.String({ format: "email" }),
							eventTitle: Type.String(),
							checkInUrl: Type.String({ format: "uri" }),
						}),
					}),
				},
			},
		},
		async (request, _reply) => {
			const { attendeeId } = request.params;

			const attendee = await prisma.attendee.findUnique({
				select: {
					name: true,
					email: true,
					event: {
						select: {
							title: true,
						},
					},
				},
				where: { id: attendeeId },
			});

			if (!attendee) {
				throw app.httpErrors.notFound("Attendee not found");
			}

			const checkInUrl = new URL(`/attendees/${attendeeId}/check-in`, `${request.protocol}://${request.hostname}`);

			return {
				badge: {
					name: attendee.name,
					email: attendee.email,
					eventTitle: attendee.event.title,
					checkInUrl: checkInUrl.toString(),
				},
			};
		},
	);
}
