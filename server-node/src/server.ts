import sensible from "@fastify/sensible";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastify from "fastify";
import { createEvent } from "./routes/create-event.js";
import { registerForEvent } from "./routes/register-for-event.js";
import { getEvent } from "./routes/get-event.js";
import { getAttendeeBadge } from "./routes/get-attendee-badge.js";

const app = fastify({
	logger: {
		transport: {
			target: "@fastify/one-line-logger",
		},
	},
}).withTypeProvider<TypeBoxTypeProvider>();

await app.register(sensible);

await app.register(createEvent);
await app.register(getAttendeeBadge);
await app.register(getEvent);
await app.register(registerForEvent);

await app.listen({ port: 3333 });
