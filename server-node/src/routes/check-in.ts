import { Type, type TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";

export async function checkIn(app: FastifyInstance) {
	app.withTypeProvider<TypeBoxTypeProvider>().get(
		"/attendees/:attendeeId/check-in",
		{
			schema: {
				summary: "Check in an attendee",
				tags: ["check-ins"],
				params: Type.Object({
					attendeeId: Type.Integer({ minimum: 1 }),
				}),
				response: {
					201: Type.Null(),
				},
			},
		},
		async (request, reply) => {
			const { attendeeId } = request.params;

			const attendeeCheckIn = await prisma.checkIn.findUnique({
				where: { attendeeId },
			});

			if (attendeeCheckIn) {
				throw app.httpErrors.conflict("Attendee already checked in");
			}

			await prisma.checkIn.create({
				data: { attendeeId },
			});

			reply.statusCode = 201;
		},
	);
}
