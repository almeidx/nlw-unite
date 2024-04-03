import { Type, type TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Prisma } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import { generateSlug } from "../utils/generate-slug.js";

export async function createEvent(app: FastifyInstance) {
	app.withTypeProvider<TypeBoxTypeProvider>().post(
		"/events",
		{
			schema: {
				body: Type.Object(
					{
						title: Type.String({ minLength: 4 }),
						details: Type.Union([Type.String(), Type.Null()]),
						maximumAttendees: Type.Union([Type.Integer({ minimum: 1 }), Type.Null()]),
					},
					{
						additionalProperties: false,
					},
				),
				response: {
					201: Type.Object({ eventId: Type.String({ format: "uuid" }) }),
				},
			},
		},
		async (request, reply) => {
			const { details, maximumAttendees, title } = request.body;

			try {
				const { id } = await prisma.event.create({
					data: {
						details,
						maximumAttendees,
						slug: generateSlug(title),
						title,
					},
					select: { id: true },
				});

				reply.statusCode = 201;
				return { eventId: id };
			} catch (error) {
				if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
					throw app.httpErrors.conflict("Slug already in use");
				}

				throw error;
			}
		},
	);
}
