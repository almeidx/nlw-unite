import { Type, type TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";

export async function getAttendeeBadge(app: FastifyInstance) {
	app.withTypeProvider<TypeBoxTypeProvider>().get(
		"/attendees/:attendeeId/badge",
		{
			schema: {
				params: Type.Object({
					attendeeId: Type.Integer({ minimum: 1 }),
				}),
				response: {
					200: Type.Object({
						attendee: Type.Object({
							name: Type.String(),
							email: Type.String(),
							event: Type.Object({
								title: Type.String(),
							}),
						}),
					}),
				},
			},
		},
		async (request, reply) => {
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

			return { attendee };
		},
	);
}
