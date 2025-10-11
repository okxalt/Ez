const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a seller
  const seller = await prisma.seller.create({
    data: {
      whopUserId: 'seller_123',
    },
  });

  console.log('✅ Created seller:', seller.id);

  // Create the trial challenge
  const challenge = await prisma.challenge.create({
    data: {
      sellerId: seller.id,
      whopProductId: 'trial_challenge',
      title: 'Trial Challenge: Get 1000 Views',
      description: 'Upload your best video and get 1000 views to win!',
      minimumViewCount: 1000,
      isActive: true,
    },
  });

  console.log('✅ Created challenge:', challenge.id);

  // Create a test submission with the provided YouTube video
  const submission = await prisma.submission.create({
    data: {
      challengeId: challenge.id,
      memberWhopUserId: 'member_123',
      memberWhopUsername: 'testuser',
      originalVideoUrl: 'https://youtube.com/shorts/4KYAiOccddo?si=-KGK7PGM9dgXN-xm',
      videoMetadata: {
        title: 'Amazing Short Video',
        thumbnail: 'https://img.youtube.com/vi/4KYAiOccddo/maxresdefault.jpg',
        provider: 'youtube',
      },
      status: 'SUBMITTED',
      submissionInstructions: 'Please upload a screen recording of your analytics showing 1000+ views',
    },
  });

  console.log('✅ Created submission:', submission.id);
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });