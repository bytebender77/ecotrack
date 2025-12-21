import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding challenges...');

    // Clear existing challenges
    await prisma.challenge.deleteMany();

    const challenges = [
        {
            title: "Bike to Work Week",
            description: "Commute by bicycle for 5 days this week",
            type: "weekly",
            category: "transport",
            target: { action: "bike_commute", count: 5, unit: "days" },
            reward: 500,
            badgeId: null,
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            isActive: true
        },
        {
            title: "Meatless Monday Challenge",
            description: "Go vegetarian or vegan for every Monday this month",
            type: "monthly",
            category: "food",
            target: { action: "vegetarian_meal", count: 4, unit: "meals" },
            reward: 300,
            badgeId: null,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
            isActive: true
        },
        {
            title: "Zero Car Day",
            description: "Go one full day without using a car",
            type: "daily",
            category: "transport",
            target: { action: "no_car", count: 1, unit: "day" },
            reward: 100,
            badgeId: null,
            startDate: new Date(),
            endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
            isActive: true
        },
        {
            title: "Energy Saver Sprint",
            description: "Reduce your daily energy consumption by 20% for a week",
            type: "weekly",
            category: "energy",
            target: { action: "reduce_energy", count: 20, unit: "percent" },
            reward: 400,
            badgeId: null,
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            isActive: true
        },
        {
            title: "Vegan Victory",
            description: "Eat only plant-based meals for 3 consecutive days",
            type: "daily",
            category: "food",
            target: { action: "vegan_meal", count: 9, unit: "meals" },
            reward: 250,
            badgeId: null,
            startDate: new Date(),
            endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            isActive: true
        },
        {
            title: "Public Transit Champion",
            description: "Use only public transport for your commute for 2 weeks",
            type: "weekly",
            category: "transport",
            target: { action: "public_transit", count: 10, unit: "trips" },
            reward: 600,
            badgeId: null,
            startDate: new Date(),
            endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            isActive: true
        }
    ];

    for (const challenge of challenges) {
        await prisma.challenge.create({
            data: challenge
        });
        console.log(`✅ Created: ${challenge.title}`);
    }

    console.log('🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
