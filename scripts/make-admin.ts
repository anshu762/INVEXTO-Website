import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.argv[2] || "kshitijvaishnav4@gmail.com";

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
    });
    console.log(`✅ Admin set successfully for ${user.email} (${user.name})`);
  } catch (err) {
    console.error("❌ Failed to set admin:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
