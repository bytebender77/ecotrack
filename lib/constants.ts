export const EMISSION_FACTORS = {
    transport: {
        car: 0.192, // kg CO2 per km (average petrol car)
        bus: 0.105, // kg CO2 per km
        train: 0.041, // kg CO2 per km
        bike: 0,
        flight: 0.255, // kg CO2 per km (short haul)
        ev: 0.053, // kg CO2 per km
    },
    food: {
        meat: 27.0, // kg CO2 per kg (average red meat)
        lamb: 39.2,
        pork: 12.1,
        chicken: 6.9,
        fish: 6.1,
        vegetarian: 2.0, // average meal
        vegan: 1.5, // average meal
    },
    energy: {
        electricity_grid: 0.233, // kg CO2 per kWh (global avg approx)
        electricity_green: 0.0,
        natural_gas: 0.202, // kg CO2 per kWh
        lpg: 0.227, // kg CO2 per kWh
        oil: 0.279, // kg CO2 per kWh
    }
};

export const TIPS = {
    transport: [
        "Carpooling can reduce your footprint by up to 50%.",
        "Switching to an EV saves approx 2 tons of CO2 per year.",
        "Biking short distances is zero emission and great for health!"
    ],
    food: [
        "Eating vegetarian one day a week saves ~150kg CO2/year.",
        "Buying local seasonal produce reduces transport emissions.",
        "Beef has the highest carbon footprint of all meats."
    ],
    energy: [
        "Switching to LED bulbs saves up to 80% energy.",
        "Unplugging electronics when not in use prevents phantom load.",
        "Lowering thermostat by 1°C can save 10% on heating bills."
    ]
};
