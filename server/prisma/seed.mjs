import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Seeding database...");

	// No demo applications anymore
	// Optionally, you could seed a test user here while developing:
	/*
	const user = await prisma.user.create({
		data: {
			email: "test@example.com",
			password: "hashedpassword", // store hashed if you seed
		},
	});
	*/

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
