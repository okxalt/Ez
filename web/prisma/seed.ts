import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const whop = await prisma.whop.upsert({
    where: { slug: 'trial' },
    update: {},
    create: { slug: 'trial', name: 'Trial Whop' },
  });
  await prisma.admin.upsert({
    where: { whopId_email: { whopId: whop.id, email: 'admin@trial.local' } },
    update: {},
    create: { email: 'admin@trial.local', whopId: whop.id },
  });

  const samples = [
    {
      username: 'creator_one',
      shortVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      analyticsVideoPath: 'https://filesamples.com/samples/video/mp4/sample_960x400_ocean_with_audio.mp4',
      currentViews: 12345,
    },
    {
      username: 'creator_two',
      shortVideoUrl: 'https://www.tiktok.com/@scout2015/video/6718335390845095173',
      analyticsVideoPath: 'https://filesamples.com/samples/video/mp4/sample_640x360.mp4',
      currentViews: 98765,
    },
  ];

  for (const s of samples) {
    await prisma.submission.create({ data: { ...s, whopId: whop.id } });
  }

  console.log('Seeded trial data');
}

main().finally(() => prisma.$disconnect());
