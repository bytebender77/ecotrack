/**
 * Smart Comparison Engine for EcoTrack
 * Provides context-aware comparisons based on activity category
 */

export interface SmartComparison {
    message: string;
    icon: string;
}

/**
 * Generate smart, contextual comparisons for carbon impact
 */
export function getSmartComparison(
    carbonKg: number,
    category: string
): SmartComparison {
    const absCarbon = Math.abs(carbonKg);
    const isPositive = carbonKg < 0; // Negative carbon = positive action

    // TRANSPORT COMPARISONS
    if (category === 'transport') {
        if (isPositive) {
            // Good transport choices
            return {
                message: `Great choice! You saved ${absCarbon.toFixed(1)} kg CO₂. That's like offsetting ${(absCarbon / 1.6).toFixed(1)} hours of AC usage! 🌿`,
                icon: '🌿'
            };
        } else {
            // Transport emissions
            if (absCarbon > 100) {
                return {
                    message: `💡 Next time: A train for this distance would emit ${(absCarbon * 0.3).toFixed(1)} kg less CO₂ (saves ${(absCarbon * 0.6).toFixed(0)} points!)`,
                    icon: '🚆'
                };
            } else if (absCarbon > 10) {
                return {
                    message: `💡 Alternative: Taking a bus would save ${(absCarbon * 0.75).toFixed(1)} kg CO₂ (worth ${(absCarbon * 1.5).toFixed(0)} extra points!)`,
                    icon: '🚌'
                };
            } else {
                return {
                    message: `💡 Eco tip: Cycling this distance = 0 emissions + ${(absCarbon * 2).toFixed(0)} bonus points saved!`,
                    icon: '🚴'
                };
            }
        }
    }

    // DEVICE COMPARISONS
    if (category === 'device') {
        if (absCarbon > 5) {
            // High AC usage
            return {
                message: `💡 Smart tip: Using a fan instead saves ${(absCarbon * 0.95).toFixed(1)} kg CO₂ (${(absCarbon * 1.9).toFixed(0)} points). Stay cool sustainably!`,
                icon: '🌀'
            };
        } else if (absCarbon > 1) {
            return {
                message: `💡 Did you know? This equals ${(absCarbon / 0.02).toFixed(0)} hours of phone usage or ${(absCarbon / 0.005).toFixed(0)} printed pages avoided.`,
                icon: '📱'
            };
        } else {
            return {
                message: `Small actions add up! Reduce screen time by 1hr/day = -7.3 kg CO₂/year (worth +15 points monthly!)`,
                icon: '⏱️'
            };
        }
    }

    // FOOD COMPARISONS
    if (category === 'food') {
        if (isPositive) {
            // Vegetarian/Vegan choice
            const mealsPerYear = 365;
            const yearlyImpact = absCarbon * mealsPerYear;
            return {
                message: `🌱 Amazing! If you do this daily, you'll save ${yearlyImpact.toFixed(0)} kg CO₂/year. That's like planting ${(yearlyImpact / 20).toFixed(1)} trees! 🌳`,
                icon: '🌱'
            };
        } else {
            // Non-veg meal
            return {
                message: `💡 Switch to vegetarian: Choosing veg just 3x/week saves ${(absCarbon * 3 * 52).toFixed(0)} kg/year (worth +${(absCarbon * 3 * 52 * 2).toFixed(0)} points)!`,
                icon: '🥗'
            };
        }
    }

    // GREEN ACTIONS
    if (category === 'green') {
        if (absCarbon >= 20) {
            // Tree planting
            const acHours = (absCarbon / 1.6).toFixed(1);
            const flights = (absCarbon / 127.5).toFixed(2);
            return {
                message: `🎉 AMAZING! This tree offsets ${acHours} hours of AC or ${flights} flights (500km). You're an Eco Warrior! 🌳`,
                icon: '🏆'
            };
        } else {
            return {
                message: `Great work! This offsets ${(absCarbon / 0.24).toFixed(0)} km of car travel. Small green actions = BIG impact over time! 💚`,
                icon: '💚'
            };
        }
    }

    // STUDENT TASKS
    if (category === 'student') {
        if (isPositive) {
            const pagesAvoided = (absCarbon / 0.005).toFixed(0);
            return {
                message: `📚 Smart choice! This equals ${pagesAvoided} pages not printed. Go digital = save trees + earn points! 📱`,
                icon: '📱'
            };
        } else {
            return {
                message: `💡 Tip: Switch to digital notes for a semester = -${(0.2 * 120).toFixed(0)} kg CO₂ (worth +${(0.2 * 120 * 2).toFixed(0)} points)!`,
                icon: '💻'
            };
        }
    }

    // LIFESTYLE COMPARISONS
    if (category === 'lifestyle') {
        return {
            message: `💡 Every choice counts! This equals ${(absCarbon / 0.12).toFixed(1)} plastic bottles. Choose reusable = sustainable living! ♻️`,
            icon: '♻️'
        };
    }

    // ENERGY COMPARISONS
    if (category === 'energy') {
        if (absCarbon > 20) {
            // High energy usage
            return {
                message: `💡 Going solar? This much energy from solar panels = -${absCarbon.toFixed(1)} kg CO₂ (worth +${(absCarbon * 2).toFixed(0)} points)!`,
                icon: '☀️'
            };
        } else {
            return {
                message: `💡 Energy tip: LED bulbs save 75% energy. Small switches = big savings over time! 💡`,
                icon: '💡'
            };
        }
    }

    // DEFAULT FALLBACK (generic but still useful)
    if (isPositive) {
        return {
            message: `Great choice! You're offsetting ${(absCarbon / 1.6).toFixed(1)} hours of AC usage or ${(absCarbon / 0.24).toFixed(0)} km of car travel! 🌿`,
            icon: '🌿'
        };
    } else {
        return {
            message: `💡 To offset this: walk ${(absCarbon / 0.24).toFixed(0)} km, plant ${(absCarbon / 20).toFixed(1)} trees, or choose veg for ${(absCarbon / 2).toFixed(0)} meals!`,
            icon: '💡'
        };
    }
}
