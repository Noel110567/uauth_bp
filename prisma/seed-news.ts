import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.news.createMany({
    data: [
      {
        title: 'AI Revolutionizes Healthcare',
        summary: 'Artificial Intelligence is transforming the healthcare industry with faster diagnostics and personalized treatments.',
        date: new Date('2025-08-10'),
        slug: 'ai-revolutionizes-healthcare',
        priority: 1,
      },
      {
        title: 'SpaceX Launches New Rocket',
        summary: 'SpaceX successfully launched its latest rocket, marking a new era in commercial space travel.',
        date: new Date('2025-08-12'),
        slug: 'spacex-launches-new-rocket',
        priority: 1,
      },
      {
        title: 'Global Markets Rally',
        summary: 'Stock markets around the world rallied today on positive economic news and strong earnings reports.',
        date: new Date('2025-08-15'),
        slug: 'global-markets-rally',
        priority: 0,
      },
      {
        title: 'Breakthrough in Renewable Energy',
        summary: 'Scientists have developed a new method to store renewable energy more efficiently, paving the way for a greener future.',
        date: new Date('2025-08-16'),
        slug: 'breakthrough-in-renewable-energy',
        priority: 1,
      },
      {
        title: 'Medical Breakthrough in Cancer Research',
        summary: 'A new treatment shows promise in the fight against cancer, with successful trials reported this week.',
        date: new Date('2025-08-17'),
        slug: 'medical-breakthrough-in-cancer-research',
        priority: 0,
      },
      {
        title: 'Wildlife Conservation Success',
        summary: 'Conservationists celebrate a major victory as endangered species populations begin to recover.',
        date: new Date('2025-08-18'),
        slug: 'wildlife-conservation-success',
        priority: 0,
      },
      {
        title: 'Tech Giants Announce Merger',
        summary: 'Two leading technology companies have announced a merger, creating a new powerhouse in the industry.',
        date: new Date('2025-08-18'),
        slug: 'tech-giants-announce-merger',
        priority: 1,
      },
      {
        title: 'Electric Vehicles Gain Popularity',
        summary: 'Sales of electric vehicles continue to rise as consumers seek more sustainable transportation options.',
        date: new Date('2025-08-14'),
        slug: 'electric-vehicles-gain-popularity',
        priority: 0,
      }
    ],
    skipDuplicates: true,
  });
  console.log('News items seeded!');
}

main().finally(() => prisma.$disconnect());
