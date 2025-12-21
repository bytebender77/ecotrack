// Real-world impact equivalence calculations
// Shows carbon impact in relatable, tangible terms

interface ImpactEquivalence {
    icon: string;
    value: string;
    label: string;
    description: string;
}

// Constants for conversions (based on EPA and scientific data)
const CARBON_PER_TREE_YEAR = 21; // kg CO₂ absorbed by 1 tree per year
const CARBON_PER_KM_CAR = 0.21; // kg CO₂ per km driven (avg car)
const CARBON_PER_FLIGHT_HOUR = 255; // kg CO₂ per hour of flight
const CARBON_PER_BURGER = 0.5; // kg CO₂ per beef burger
const CARBON_PER_SMARTPHONE_CHARGE = 0.008; // kg CO₂ per charge
const CARBON_PER_SHOWER = 0.5; // kg CO₂ per 10-min hot shower
const CARBON_PER_PLASTIC_BOTTLE = 0.082; // kg CO₂ per plastic bottle

export function getImpactEquivalences(carbonKg: number): ImpactEquivalence[] {
    const absCarbon = Math.abs(carbonKg);
    const isPositive = carbonKg < 0; // Negative carbon = avoided = positive impact

    const equivalences: ImpactEquivalence[] = [];

    // Tree equivalent
    const trees = absCarbon / CARBON_PER_TREE_YEAR;
    if (trees >= 0.01) {
        equivalences.push({
            icon: "🌳",
            value: trees >= 1 ? trees.toFixed(1) : (trees * 12).toFixed(0),
            label: trees >= 1 ? "trees for a year" : "tree-months",
            description: isPositive
                ? `You've planted the equivalent of ${trees >= 1 ? trees.toFixed(1) + ' trees' : (trees * 12).toFixed(0) + ' tree-months'}!`
                : `This equals ${trees >= 1 ? trees.toFixed(1) + ' trees\' worth' : (trees * 12).toFixed(0) + ' tree-months'} of emissions`
        });
    }

    // Car distance equivalent
    const carKm = absCarbon / CARBON_PER_KM_CAR;
    if (carKm >= 1) {
        equivalences.push({
            icon: "🚗",
            value: carKm.toFixed(0),
            label: "km NOT driven",
            description: isPositive
                ? `Same as keeping a car parked for ${carKm.toFixed(0)} km!`
                : `Same as driving ${carKm.toFixed(0)} km by car`
        });
    }

    // Burgers equivalent
    const burgers = absCarbon / CARBON_PER_BURGER;
    if (burgers >= 1 && absCarbon < 50) {
        equivalences.push({
            icon: "🍔",
            value: burgers.toFixed(0),
            label: "burgers saved",
            description: isPositive
                ? `Equivalent to skipping ${burgers.toFixed(0)} beef burgers!`
                : `Same carbon as ${burgers.toFixed(0)} beef burgers`
        });
    }

    // Phone charges equivalent (for small impacts)
    const charges = absCarbon / CARBON_PER_SMARTPHONE_CHARGE;
    if (absCarbon < 1 && charges >= 1) {
        equivalences.push({
            icon: "📱",
            value: charges.toFixed(0),
            label: "phone charges",
            description: isPositive
                ? `Like ${charges.toFixed(0)} phone charges saved!`
                : `Same as charging your phone ${charges.toFixed(0)} times`
        });
    }

    // Plastic bottles equivalent
    const bottles = absCarbon / CARBON_PER_PLASTIC_BOTTLE;
    if (bottles >= 5) {
        equivalences.push({
            icon: "🧴",
            value: bottles.toFixed(0),
            label: "plastic bottles",
            description: isPositive
                ? `Equal to ${bottles.toFixed(0)} plastic bottles avoided!`
                : `Same footprint as ${bottles.toFixed(0)} plastic bottles`
        });
    }

    // Flight hours equivalent (for large impacts)
    const flightHours = absCarbon / CARBON_PER_FLIGHT_HOUR;
    if (flightHours >= 0.5) {
        equivalences.push({
            icon: "✈️",
            value: flightHours >= 1 ? flightHours.toFixed(1) : (flightHours * 60).toFixed(0),
            label: flightHours >= 1 ? "flight hours" : "flight minutes",
            description: isPositive
                ? `Like skipping ${flightHours >= 1 ? flightHours.toFixed(1) + ' hours' : (flightHours * 60).toFixed(0) + ' mins'} of flying!`
                : `Equivalent to ${flightHours >= 1 ? flightHours.toFixed(1) + ' hours' : (flightHours * 60).toFixed(0) + ' mins'} of flight`
        });
    }

    return equivalences.slice(0, 3); // Return top 3 most relevant
}

export function getPrimaryEquivalence(carbonKg: number): ImpactEquivalence | null {
    const equivalences = getImpactEquivalences(carbonKg);
    return equivalences[0] || null;
}

// Get a motivational message based on impact
export function getImpactMessage(carbonKg: number): string {
    const absCarbon = Math.abs(carbonKg);
    const isPositive = carbonKg < 0;

    if (!isPositive) {
        if (absCarbon < 5) return "Small step, but every bit counts! 💪";
        if (absCarbon < 20) return "Good awareness - try alternatives next time! 🌱";
        return "High impact activity - consider greener options! 🌍";
    }

    if (absCarbon < 1) return "Every small action matters! 🌱";
    if (absCarbon < 5) return "Nice work, eco warrior! 💚";
    if (absCarbon < 20) return "Fantastic impact! You're making a difference! 🌟";
    if (absCarbon < 50) return "Incredible! You're a planet hero! 🦸‍♀️";
    return "LEGENDARY impact! The Earth thanks you! 🌍✨";
}
