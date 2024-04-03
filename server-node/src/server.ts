import fastify from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { Prisma, PrismaClient } from "@prisma/client";
import sensible from "@fastify/sensible";

const prisma = new PrismaClient({
	log: ["query"],
});

const app = fastify({
	logger: {
		transport: {
			target: "@fastify/one-line-logger",
		},
	},
}).withTypeProvider<TypeBoxTypeProvider>();

await app.register(sensible);

app.post(
	"/events",
	{
		schema: {
			body: Type.Object(
				{
					title: Type.String({ minLength: 4 }),
					details: Type.String({ nullable: true }),
					maximumAttendees: Type.Integer({ minimum: 1, nullable: true }),
					slug: Type.String(),
				},
				{
					additionalProperties: false,
				},
			),
		},
	},
	async (request, reply) => {
		try {
			const { id } = await prisma.event.create({ data: request.body, select: { id: true } });

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

await app.listen({ port: 3333 });
