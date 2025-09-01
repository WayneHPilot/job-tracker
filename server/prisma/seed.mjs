import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Seeding database...");

	await prisma.application.createMany({
		data: [
			{
				company: "Google",
				role: "Frontend Developer",
				status: "applied",
				dateApplied: new Date("2025-08-01"),
			},
			{
				company: "Microsoft",
				role: "Backend Developer",
				status: "interviewing",
				dateApplied: new Date("2025-08-05"),
			},
			{
				company: "OpenAI",
				role: "Fullstack Engineer",
				status: "offer",
				dateApplied: new Date("2025-08-10"),
			},
		],
	});

	console.log("✅ Seeding complete!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
