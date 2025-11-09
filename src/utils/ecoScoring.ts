// Eco-Friendly Scoring System
// Calculates user's eco score based on their actual choices

interface EcoScoreResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  category: string;
  categoryIcon: string;
  breakdown: {
    transportation: { score: number; max: number; feedback: string };
    diet: { score: number; max: number; feedback: string };
    shopping: { score: number; max: number; feedback: string };
    recycling: { score: number; max: number; feedback: string };
    reusables: { score: number; max: number; feedback: string };
    energy: { score: number; max: number; feedback: string };
    paperDigital: { score: number; max: number; feedback: string };
    travel: { score: number; max: number; feedback: string };
  };
  strengths: string[];
  improvements: string[];
  co2SavedAnnually: number; // in kg
  treesEquivalent: number;
}

export function calculateEcoScore(formData: any): EcoScoreResult {
  const breakdown = {
    // Transportation (0-100 points)
    transportation: calculateTransportationScore(formData.transportation),

    // Diet (0-100 points)
    diet: calculateDietScore(formData.meatDairy),

    // Shopping (0-100 points)
    shopping: calculateShoppingScore(formData.shopping),

    // Recycling (0-100 points)
    recycling: calculateRecyclingScore(formData.recycling),

    // Reusables (0-100 points)
    reusables: calculateReusablesScore(formData.reusables),

    // Energy (0-100 points)
    energy: calculateEnergyScore(formData.homeEnergy),

    // Paper/Digital (0-100 points)
    paperDigital: calculatePaperDigitalScore(formData.paperDigital),

    // Travel (0-100 points)
    travel: calculateTravelScore(formData.planeTravel),
  };

  const totalScore = Object.values(breakdown).reduce((sum, item) => sum + item.score, 0);
  const maxScore = Object.values(breakdown).reduce((sum, item) => sum + item.max, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);

  // Determine category based on percentage
  const { category, categoryIcon } = determineCategory(percentage);

  // Identify strengths (scores >= 80)
  const strengths = identifyStrengths(breakdown);

  // Identify areas for improvement (scores < 60)
  const improvements = identifyImprovements(breakdown);

  // Calculate environmental impact
  const { co2SavedAnnually, treesEquivalent } = calculateEnvironmentalImpact(breakdown);

  return {
    totalScore,
    maxScore,
    percentage,
    category,
    categoryIcon,
    breakdown,
    strengths,
    improvements,
    co2SavedAnnually,
    treesEquivalent,
  };
}

// Individual scoring functions
function calculateTransportationScore(value: string) {
  const scores: Record<string, { score: number; feedback: string }> = {
    walk: {
      score: 100,
      feedback: "Perfect! Walking has zero emissions and keeps you healthy."
    },
    bike: {
      score: 100,
      feedback: "Perfect! Biking has zero emissions and keeps you healthy."
    },
    public: {
      score: 70,
      feedback: "Great! Public transport reduces emissions by 45% vs driving alone."
    },
    drive: {
      score: 20,
      feedback: "Consider alternatives: each gallon of gas produces ~20 lbs of CO2."
    },
    fly: {
      score: 10,
      feedback: "Flying frequently has the highest carbon impact. Try other transport options."
    },
  };
  return { ...scores[value] || { score: 0, feedback: "" }, max: 100 };
}

function calculateDietScore(value: string) {
  const scores: Record<string, { score: number; feedback: string }> = {
    never: {
      score: 100,
      feedback: "Amazing! Plant-based diets can reduce food carbon footprint by 73%."
    },
    occasionally: {
      score: 60,
      feedback: "Good! Reducing meat intake significantly lowers your carbon footprint."
    },
    "few-times": {
      score: 30,
      feedback: "Try 'Meatless Mondays' - even one day/week saves ~200kg CO2/year."
    },
    daily: {
      score: 10,
      feedback: "Meat production accounts for 60% of food greenhouse gases. Try reducing intake."
    },
  };
  return { ...scores[value] || { score: 0, feedback: "" }, max: 100 };
}

function calculateShoppingScore(value: string) {
  const scores: Record<string, { score: number; feedback: string }> = {
    thrift: {
      score: 100,
      feedback: "Excellent! Secondhand shopping prevents 500kg CO2 per year on average."
    },
    "few-items": {
      score: 70,
      feedback: "Smart! Quality over quantity reduces waste and resources."
    },
    regular: {
      score: 20,
      feedback: "Fashion industry produces 10% of global CO2. Try reducing purchases."
    },
  };
  return { ...scores[value] || { score: 0, feedback: "" }, max: 100 };
}

function calculateRecyclingScore(value: string) {
  const scores: Record<string, { score: number; feedback: string }> = {
    yes: {
      score: 100,
      feedback: "Perfect! Recycling saves 30% of waste from landfills."
    },
    sometimes: {
      score: 50,
      feedback: "Good start! Try to recycle consistently - it becomes a habit."
    },
    no: {
      score: 10,
      feedback: "Start small: recycling paper alone saves 17 trees per ton."
    },
  };
  return { ...scores[value] || { score: 0, feedback: "" }, max: 100 };
}

function calculateReusablesScore(value: string) {
  const scores: Record<string, { score: number; feedback: string }> = {
    always: {
      score: 100,
      feedback: "Fantastic! You prevent ~500 single-use items from landfills yearly."
    },
    often: {
      score: 70,
      feedback: "Great! Keep it up - reusables save money and the planet."
    },
    sometimes: {
      score: 40,
      feedback: "Try carrying a reusable bag and water bottle everywhere."
    },
    rarely: {
      score: 10,
      feedback: "1 million plastic bottles are sold per minute. Switch to reusables!"
    },
  };
  return { ...scores[value] || { score: 0, feedback: "" }, max: 100 };
}

function calculateEnergyScore(value: string) {
  const scores: Record<string, { score: number; feedback: string }> = {
    renewable: {
      score: 100,
      feedback: "Outstanding! Renewable energy cuts your carbon footprint by 70%."
    },
    mixed: {
      score: 60,
      feedback: "Good progress! Consider switching more to renewables."
    },
    grid: {
      score: 20,
      feedback: "Explore solar panels or green energy plans from your utility."
    },
  };
  return { ...scores[value] || { score: 0, feedback: "" }, max: 100 };
}

function calculatePaperDigitalScore(value: string) {
  const scores: Record<string, { score: number; feedback: string }> = {
    digital: {
      score: 100,
      feedback: "Perfect! Going digital saves ~24 trees per person annually."
    },
    both: {
      score: 50,
      feedback: "Try digital bills and e-books to reduce paper use."
    },
    paper: {
      score: 10,
      feedback: "Paper production uses huge amounts of water and energy."
    },
  };
  return { ...scores[value] || { score: 0, feedback: "" }, max: 100 };
}

function calculateTravelScore(value: string) {
  const scores: Record<string, { score: number; feedback: string }> = {
    never: {
      score: 100,
      feedback: "Excellent! Air travel is the biggest individual carbon source."
    },
    once: {
      score: 60,
      feedback: "Moderate! Consider carbon offsets for necessary flights."
    },
    "few-times": {
      score: 30,
      feedback: "One round-trip flight emits ~1 ton CO2. Explore alternatives."
    },
    frequently: {
      score: 10,
      feedback: "Frequent flying significantly impacts your carbon footprint."
    },
  };
  return { ...scores[value] || { score: 0, feedback: "" }, max: 100 };
}

function determineCategory(percentage: number): { category: string; categoryIcon: string } {
  if (percentage >= 90) {
    return { category: "Eco Champion", categoryIcon: "🏆" };
  } else if (percentage >= 75) {
    return { category: "Green Leader", categoryIcon: "🌟" };
  } else if (percentage >= 60) {
    return { category: "Eco Warrior", categoryIcon: "💚" };
  } else if (percentage >= 45) {
    return { category: "Green Learner", categoryIcon: "🌱" };
  } else if (percentage >= 30) {
    return { category: "Eco Explorer", categoryIcon: "🌿" };
  } else {
    return { category: "Green Beginner", categoryIcon: "🌍" };
  }
}

function identifyStrengths(breakdown: any): string[] {
  const strengths: string[] = [];

  if (breakdown.transportation.score >= 80) strengths.push("Sustainable Transportation");
  if (breakdown.diet.score >= 80) strengths.push("Plant-Based Diet");
  if (breakdown.shopping.score >= 80) strengths.push("Conscious Shopping");
  if (breakdown.recycling.score >= 80) strengths.push("Recycling Habits");
  if (breakdown.reusables.score >= 80) strengths.push("Reusable Products");
  if (breakdown.energy.score >= 80) strengths.push("Clean Energy");
  if (breakdown.paperDigital.score >= 80) strengths.push("Digital Lifestyle");
  if (breakdown.travel.score >= 80) strengths.push("Low-Carbon Travel");

  return strengths;
}

function identifyImprovements(breakdown: any): string[] {
  const improvements: string[] = [];

  if (breakdown.transportation.score < 60) improvements.push("Try walking, biking, or public transport more often");
  if (breakdown.diet.score < 60) improvements.push("Reduce meat consumption - start with Meatless Mondays");
  if (breakdown.shopping.score < 60) improvements.push("Choose quality over quantity and consider secondhand");
  if (breakdown.recycling.score < 60) improvements.push("Make recycling a consistent habit");
  if (breakdown.reusables.score < 60) improvements.push("Carry reusable bags, bottles, and containers");
  if (breakdown.energy.score < 60) improvements.push("Explore renewable energy options");
  if (breakdown.paperDigital.score < 60) improvements.push("Switch to digital bills and documents");
  if (breakdown.travel.score < 60) improvements.push("Reduce air travel or purchase carbon offsets");

  return improvements;
}

function calculateEnvironmentalImpact(breakdown: any): { co2SavedAnnually: number; treesEquivalent: number } {
  // Calculate CO2 saved based on eco-friendly choices (in kg per year)
  let co2Saved = 0;

  // Transportation (walk/bike vs drive: ~2000 kg CO2/year)
  co2Saved += (breakdown.transportation.score / 100) * 2000;

  // Diet (plant-based vs meat-heavy: ~1500 kg CO2/year)
  co2Saved += (breakdown.diet.score / 100) * 1500;

  // Shopping (secondhand vs new: ~500 kg CO2/year)
  co2Saved += (breakdown.shopping.score / 100) * 500;

  // Recycling (~300 kg CO2/year)
  co2Saved += (breakdown.recycling.score / 100) * 300;

  // Reusables (~200 kg CO2/year)
  co2Saved += (breakdown.reusables.score / 100) * 200;

  // Renewable energy (~1000 kg CO2/year)
  co2Saved += (breakdown.energy.score / 100) * 1000;

  // Digital vs paper (~100 kg CO2/year)
  co2Saved += (breakdown.paperDigital.score / 100) * 100;

  // Reduced air travel (~1000 kg CO2/year)
  co2Saved += (breakdown.travel.score / 100) * 1000;

  // One tree absorbs ~21 kg CO2 per year
  const treesEquivalent = Math.round(co2Saved / 21);

  return {
    co2SavedAnnually: Math.round(co2Saved),
    treesEquivalent,
  };
}
