/**
 * Comprehensive Activity Catalog for EcoTrack
 * 
 * Core Formula: carbon = quantity × emission_factor
 * Points Formula: points = carbon × 2
 * 
 * - Emissions (positive carbon) → negative points
 * - Avoidance (negative carbon) → positive points
 */

export interface Activity {
    id: string;
    category: 'transport' | 'device' | 'food' | 'green' | 'student' | 'lifestyle';
    name: string;
    carbonPerUnit: number; // kg CO₂e per unit (emission factor)
    unit: string;
    description: string;
    isEmission: boolean;
}

export const ACTIVITY_CATALOG: Activity[] = [
    // 🚗 TRANSPORT (kg CO₂e per km)
    {
        id: 'flight',
        category: 'transport',
        name: 'Flight',
        carbonPerUnit: 0.255,
        unit: 'km',
        description: 'Air travel emissions',
        isEmission: true
    },
    {
        id: 'car',
        category: 'transport',
        name: 'Car',
        carbonPerUnit: 0.24,
        unit: 'km',
        description: 'Car travel',
        isEmission: true
    },
    {
        id: 'bike_motor',
        category: 'transport',
        name: 'Motorcycle',
        carbonPerUnit: 0.09,
        unit: 'km',
        description: 'Motorcycle/scooter ride',
        isEmission: true
    },
    {
        id: 'auto_rickshaw',
        category: 'transport',
        name: 'Auto-rickshaw',
        carbonPerUnit: 0.21,
        unit: 'km',
        description: 'Auto-rickshaw ride',
        isEmission: true
    },
    {
        id: 'bus',
        category: 'transport',
        name: 'Bus',
        carbonPerUnit: -0.18, // Avoided emissions vs car
        unit: 'km',
        description: 'Public transport (avoided car emissions)',
        isEmission: false
    },
    {
        id: 'walk',
        category: 'transport',
        name: 'Walking',
        carbonPerUnit: -0.24, // Full car emission avoided!
        unit: 'km',
        description: 'Walking instead of driving',
        isEmission: false
    },
    {
        id: 'bicycle',
        category: 'transport',
        name: 'Cycling',
        carbonPerUnit: -0.24, // Full car emission avoided!
        unit: 'km',
        description: 'Cycling instead of driving',
        isEmission: false
    },

    // 📱 DEVICE & ENERGY (kg CO₂e per hour)
    {
        id: 'phone_usage',
        category: 'device',
        name: 'Phone Usage',
        carbonPerUnit: 0.02,
        unit: 'hours',
        description: 'Smartphone usage and charging',
        isEmission: true
    },
    {
        id: 'laptop_usage',
        category: 'device',
        name: 'Laptop Usage',
        carbonPerUnit: 0.10,
        unit: 'hours',
        description: 'Laptop usage',
        isEmission: true
    },
    {
        id: 'gaming',
        category: 'device',
        name: 'Gaming',
        carbonPerUnit: 0.25,
        unit: 'hours',
        description: 'Gaming console or PC',
        isEmission: true
    },
    {
        id: 'ac_usage',
        category: 'device',
        name: 'Air Conditioner',
        carbonPerUnit: 1.60,
        unit: 'hours',
        description: 'AC usage',
        isEmission: true
    },
    {
        id: 'fan_usage',
        category: 'device',
        name: 'Fan',
        carbonPerUnit: 0.075,
        unit: 'hours',
        description: 'Fan usage',
        isEmission: true
    },

    // 🍔 FOOD (kg CO₂e per meal)
    {
        id: 'non_veg_meal',
        category: 'food',
        name: 'Non-Veg Meal',
        carbonPerUnit: 4.0,
        unit: 'meal',
        description: 'Meal with meat',
        isEmission: true
    },
    {
        id: 'vegetarian_meal',
        category: 'food',
        name: 'Vegetarian Meal',
        carbonPerUnit: -2.0, // Avoided emissions
        unit: 'meal',
        description: 'Vegetarian meal (avoided emissions)',
        isEmission: false
    },
    {
        id: 'vegan_meal',
        category: 'food',
        name: 'Vegan Meal',
        carbonPerUnit: -2.5, // Avoided emissions
        unit: 'meal',
        description: 'Vegan meal (avoided emissions)',
        isEmission: false
    },
    {
        id: 'food_delivery',
        category: 'food',
        name: 'Food Delivery',
        carbonPerUnit: 1.2,
        unit: 'order',
        description: 'Online food delivery',
        isEmission: true
    },

    // 🧺 LIFESTYLE & WASTE
    {
        id: 'printed_pages',
        category: 'lifestyle',
        name: 'Printing',
        carbonPerUnit: 0.005,
        unit: 'pages',
        description: 'Printed documents',
        isEmission: true
    },
    {
        id: 'plastic_bottle',
        category: 'lifestyle',
        name: 'Plastic Bottle',
        carbonPerUnit: 0.12,
        unit: 'bottle',
        description: 'Single-use plastic bottle',
        isEmission: true
    },
    {
        id: 'laundry',
        category: 'lifestyle',
        name: 'Laundry Wash',
        carbonPerUnit: 0.6,
        unit: 'wash',
        description: 'Washing machine cycle',
        isEmission: true
    },
    {
        id: 'long_shower',
        category: 'lifestyle',
        name: 'Long Shower',
        carbonPerUnit: 0.3,
        unit: 'shower',
        description: 'Extended hot water shower',
        isEmission: true
    },

    // 🌱 GREEN ACTIONS (Avoided emissions)
    {
        id: 'plant_tree',
        category: 'green',
        name: 'Plant a Tree',
        carbonPerUnit: -20, // Annual absorption
        unit: 'tree',
        description: 'Planted a tree 🌳 (annual absorption)',
        isEmission: false
    },
    {
        id: 'water_saving',
        category: 'green',
        name: 'Water Saving',
        carbonPerUnit: -0.02,
        unit: 'liters',
        description: 'Water saved',
        isEmission: false
    },
    {
        id: 'composting',
        category: 'green',
        name: 'Composting',
        carbonPerUnit: -1.2,
        unit: 'kg',
        description: 'Composted organic waste',
        isEmission: false
    },
    {
        id: 'campus_cleanup',
        category: 'green',
        name: 'Campus Cleanup',
        carbonPerUnit: -0.3,
        unit: 'kg',
        description: 'Waste collected in cleanup',
        isEmission: false
    },

    // 📚 STUDENT TASKS
    {
        id: 'digital_notes',
        category: 'student',
        name: 'Digital Notes',
        carbonPerUnit: -0.2,
        unit: 'day',
        description: 'Used digital notes instead of printing',
        isEmission: false
    },
    {
        id: 'library_book',
        category: 'student',
        name: 'Library Book',
        carbonPerUnit: -1.0,
        unit: 'book',
        description: 'Borrowed from library instead of buying',
        isEmission: false
    },
    {
        id: 'online_class',
        category: 'student',
        name: 'Online Class',
        carbonPerUnit: -2.5,
        unit: 'class',
        description: 'Attended online instead of commuting',
        isEmission: false
    },
];

/**
 * Calculate carbon impact and points from quantity and emission factor
 * 
 * Formula:
 * - carbon = quantity × factor
 * - points = carbon × 2
 */
export interface ImpactResult {
    carbon: number; // kg CO₂e
    points: number; // EcoPoints
    carbonFormatted: string;
}

const POINTS_PER_KG = 2;

export function calculateImpact(quantity: number, factor: number): ImpactResult {
    const carbon = quantity * factor;
    const points = Math.round(carbon * POINTS_PER_KG);

    return {
        carbon,
        points,
        carbonFormatted: carbon.toFixed(2)
    };
}

/**
 * Calculate EcoPoints from carbon impact
 * Formula: 1 kg CO₂e = 2 EcoPoints
 */
export function calculatePoints(carbonKg: number): number {
    return Math.round(carbonKg * POINTS_PER_KG);
}

/**
 * Get activity by ID
 */
export function getActivity(id: string): Activity | undefined {
    return ACTIVITY_CATALOG.find(a => a.id === id);
}

/**
 * Get activities by category
 */
export function getActivitiesByCategory(category: Activity['category']): Activity[] {
    return ACTIVITY_CATALOG.filter(a => a.category === category);
}
