import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: bcrypt.hashSync('secret',12),
    },
  });

  // City seeds: fill these arrays with city names and re-run the seed script.
  // Examples: ['Casablanca', 'Rabat'] for Morocco, ['Paris', 'Lyon'] for France
  const moroccoCities: string[] = ['Asefi', 'Casa', 'Fes', 'Jadida', 'Kanitra'];
  const franceCities: string[] = ['Canne', 'Canne la bocca', 'Dariginyne', 'Farigoge', 'Maresiliya', 'Mounto', 'Nice', 'Ountibe', 'Sate Maksine', 'Vantimilya'];

  if (moroccoCities.length > 0) {
    await prisma.city.createMany({
      data: moroccoCities.map((name) => ({ name, country: 'Morocco' })),
      skipDuplicates: true,
    });
  }

  if (franceCities.length > 0) {
    await prisma.city.createMany({
      data: franceCities.map((name) => ({ name, country: 'France' })),
      skipDuplicates: true,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
