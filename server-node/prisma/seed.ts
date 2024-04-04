import { prisma } from "../src/lib/prisma.js";

await prisma.event.create({
	data: {
		id: "6e21db30-6e09-433e-8d14-25d42c119612",
		title: "NLW Unite",
		details: "A conference for developers",
		maximumAttendees: 120,
		slug: "nlw-unite",
	},
});

await prisma.$disconnect();
