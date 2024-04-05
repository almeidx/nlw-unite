import sensible from "@fastify/sensible";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastify from "fastify";
import { createEvent } from "./routes/create-event.js";
import { registerForEvent } from "./routes/register-for-event.js";
import { getEvent } from "./routes/get-event.js";
import { getAttendeeBadge } from "./routes/get-attendee-badge.js";
import { checkIn } from "./routes/check-in.js";
import { getEventAttendees } from "./routes/get-event-attendees.js";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import cors from "@fastify/cors";

const app = fastify({
	logger: {
		transport: {
			target: "@fastify/one-line-logger",
		},
	},
}).withTypeProvider<TypeBoxTypeProvider>();

await app.register(cors, {
	origin: "*",
});

await app.register(swagger, {
	swagger: {
		consumes: ["application/json"],
		produces: ["application/json"],
		info: {
			title: "pass.in",
			description: "Specification for backend API for pass.in, built during NLW Unite from Rocketseat.",
			version: "1.0.0",
		},
		tags: [
			{ name: "events", description: "Operations related to events" },
			{ name: "attendees", description: "Operations related to attendees" },
			{ name: "check-ins", description: "Operations related to check-ins" },
		],
	},
});

await app.register(swaggerUi, { routePrefix: "/docs" });

await app.register(sensible);

await app.register(checkIn);
await app.register(createEvent);
await app.register(getAttendeeBadge);
await app.register(getEventAttendees);
await app.register(getEvent);
await app.register(registerForEvent);

await app.listen({ port: 3333, host: '0.0.0.0' });
