import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding challenges...');

    const challenges = [
        // WEEKLY CHALLENGES
        {
            title: "🚴 Bike to Work Week",
            description: "Commute by bicycle for 5 days this week. Great exercise and zero emissions!",
            type: "weekly",
            category: "transport",
            target: { action: "bike_commute", count: 5, unit: "days" },
            reward: 75,
            isActive: true
        },
        {
            title: "🚶 Walk 10 km This Week",
            description: "Walk at least 10 km this week instead of driving. Great for health and the planet!",
            type: "weekly",
            category: "transport",
            target: { action: "walk", count: 10, unit: "km" },
            reward: 100,
            isActive: true
        },
        {
            title: "🥗 5 Veggie Meals Challenge",
            description: "Eat 5 vegetarian or vegan meals this week. Each meat-free meal saves about 2kg CO₂!",
            type: "weekly",
            category: "food",
            target: { action: "vegetarian_meal", count: 5, unit: "meals" },
            reward: 50,
            isActive: true
        },
        {
            title: "💡 Lights Out Challenge",
            description: "Reduce electricity usage by 20% this week. Turn off unused lights and unplug devices!",
            type: "weekly",
            category: "energy",
            target: { action: "reduce_energy", count: 20, unit: "percent" },
            reward: 60,
            isActive: true
        },
        {
            title: "♻️ Zero Waste Week",
            description: "Produce no plastic waste for 7 days. Use reusable bags, bottles, and containers!",
            type: "weekly",
            category: "green",
            target: { action: "zero_waste", count: 7, unit: "days" },
            reward: 100,
            isActive: true
        },
        {
            title: "🚌 Bus Buddy Week",
            description: "Take public transport instead of your car for all commutes this week.",
            type: "weekly",
            category: "transport",
            target: { action: "public_transit", count: 10, unit: "trips" },
            reward: 80,
            isActive: true
        },

        // MONTHLY CHALLENGES
        {
            title: "🌳 Plant a Tree",
            description: "Plant a tree this month. One tree absorbs about 20kg CO₂ per year!",
            type: "monthly",
            category: "green",
            target: { action: "plant_tree", count: 1, unit: "trees" },
            reward: 80,
            isActive: true
        },
        {
            title: "🌳 Plant 5 Trees",
            description: "Plant or sponsor 5 trees this month. Become a forest guardian!",
            type: "monthly",
            category: "green",
            target: { action: "plant_tree", count: 5, unit: "trees" },
            reward: 200,
            isActive: true
        },
        {
            title: "🚌 Public Transport Pro",
            description: "Use public transport for all commutes this month. Cars emit 4x more CO₂!",
            type: "monthly",
            category: "transport",
            target: { action: "public_transit", count: 20, unit: "days" },
            reward: 250,
            isActive: true
        },
        {
            title: "🥬 Local Food Hero",
            description: "Buy only locally sourced food for a month. Reduces transport emissions by 80%!",
            type: "monthly",
            category: "food",
            target: { action: "local_food", count: 100, unit: "percent" },
            reward: 120,
            isActive: true
        },
        {
            title: "⚡ Energy Saver Champion",
            description: "Reduce your home energy consumption by 30% this month.",
            type: "monthly",
            category: "energy",
            target: { action: "reduce_energy", count: 30, unit: "percent" },
            reward: 180,
            isActive: true
        },
        {
            title: "🎒 30-Day Eco Commuter",
            description: "Walk, bike, or use public transport for 30 days straight. No personal vehicles!",
            type: "monthly",
            category: "transport",
            target: { action: "eco_commute", count: 30, unit: "days" },
            reward: 300,
            isActive: true
        },
        {
            title: "🥗 Meatless Month",
            description: "Go fully vegetarian for an entire month. Save up to 150kg CO₂!",
            type: "monthly",
            category: "food",
            target: { action: "vegetarian", count: 30, unit: "days" },
            reward: 200,
            isActive: true
        },

        // DAILY CHALLENGES
        {
            title: "☀️ No AC Day",
            description: "Go 24 hours without air conditioning. Use natural ventilation and fans!",
            type: "daily",
            category: "energy",
            target: { action: "no_ac", count: 24, unit: "hours" },
            reward: 25,
            isActive: true
        },
        {
            title: "🥤 No Plastic Day",
            description: "Avoid all single-use plastics for one full day. Bring your own containers!",
            type: "daily",
            category: "green",
            target: { action: "no_plastic", count: 1, unit: "day" },
            reward: 20,
            isActive: true
        },
        {
            title: "🍃 Vegan Day",
            description: "Eat only plant-based foods for 24 hours. Animal agriculture produces 14.5% of emissions!",
            type: "daily",
            category: "food",
            target: { action: "vegan_day", count: 1, unit: "day" },
            reward: 30,
            isActive: true
        },
        {
            title: "🚗 Zero Car Day",
            description: "Don't use any personal vehicle for 24 hours. Walk, bike, or take public transport!",
            type: "daily",
            category: "transport",
            target: { action: "no_car", count: 1, unit: "day" },
            reward: 35,
            isActive: true
        },
        {
            title: "🌙 Early Lights Off",
            description: "Turn off all non-essential lights by 9 PM. Save energy and improve sleep!",
            type: "daily",
            category: "energy",
            target: { action: "lights_off", count: 1, unit: "day" },
            reward: 15,
            isActive: true
        },
        {
            title: "🚿 Short Shower Challenge",
            description: "Take only 5-minute showers today. Saves water and energy!",
            type: "daily",
            category: "energy",
            target: { action: "short_shower", count: 5, unit: "minutes" },
            reward: 20,
            isActive: true
        }
    ];

    // Clear existing and add all
    await prisma.challengeParticipant.deleteMany();
    await prisma.challenge.deleteMany();

    for (const challenge of challenges) {
        await prisma.challenge.create({
            data: challenge as any
        });
        console.log(`✅ Created: ${challenge.title}`);
    }

    console.log(`🎉 Seeding complete! Added ${challenges.length} challenges.`);
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
