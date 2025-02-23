
// Base depreciation rates
const INITIAL_DEPRECIATION_RATE = 0.18; // 18% first year depreciation
const ANNUAL_DEPRECIATION_RATE = 0.08; // 8% annual depreciation after first year
const CURRENT_YEAR = new Date().getFullYear();

// Mileage adjustment factors
const MILEAGE_BRACKETS = [
  { max: 5000, adjustment: 1.1 },    // Low mileage premium
  { max: 15000, adjustment: 1.0 },   // Normal mileage - no adjustment
  { max: 30000, adjustment: 0.9 },   // High mileage discount
  { max: 50000, adjustment: 0.8 },   // Very high mileage discount
  { max: Infinity, adjustment: 0.7 } // Extremely high mileage
];

// Condition adjustment factors
export type MotorcycleCondition = 'excellent' | 'good' | 'fair' | 'poor';
const CONDITION_ADJUSTMENTS: Record<MotorcycleCondition, number> = {
  excellent: 1.15, // Premium for excellent condition
  good: 1.0,      // Baseline - no adjustment
  fair: 0.85,     // Discount for fair condition
  poor: 0.7       // Significant discount for poor condition
};

// Market trend adjustments based on make popularity
const MARKET_TREND_ADJUSTMENTS: Record<string, number> = {
  'Honda': 1.05,
  'Yamaha': 1.05,
  'Kawasaki': 1.03,
  'Suzuki': 1.02,
  'Harley-Davidson': 1.1,
  'BMW': 1.08,
  'Ducati': 1.12,
  'Triumph': 1.04,
  'KTM': 1.06,
  'Indian': 1.07
};

interface ValueAdjustments {
  mileage?: number;
  condition?: MotorcycleCondition;
  make?: string;
}

export const calculateCurrentValue = (
  msrp: number, 
  year?: number | null,
  adjustments?: ValueAdjustments
): number => {
  if (typeof msrp !== 'number' || isNaN(msrp) || msrp <= 0) {
    console.error('Invalid MSRP:', msrp);
    return 0;
  }

  // If no year provided, assume current year
  const modelYear = year || CURRENT_YEAR;
  const yearsOwned = CURRENT_YEAR - modelYear;
  
  console.log('Starting calculation with:', { msrp, modelYear, yearsOwned, adjustments });

  // Step 1: Apply initial depreciation (first year)
  let currentValue = msrp * (1 - INITIAL_DEPRECIATION_RATE);
  console.log('After initial depreciation:', currentValue);

  // Step 2: Apply annual depreciation for remaining years
  if (yearsOwned > 1) {
    currentValue = currentValue * Math.pow(1 - ANNUAL_DEPRECIATION_RATE, yearsOwned - 1);
    console.log('After annual depreciation:', currentValue);
  }

  // Step 3: Apply mileage adjustment if provided
  if (adjustments?.mileage !== undefined) {
    const mileageAdjustment = MILEAGE_BRACKETS.find(bracket => adjustments.mileage! <= bracket.max)?.adjustment || 0.7;
    currentValue *= mileageAdjustment;
    console.log('After mileage adjustment:', { mileage: adjustments.mileage, adjustment: mileageAdjustment, value: currentValue });
  }

  // Step 4: Apply condition adjustment if provided
  if (adjustments?.condition) {
    const conditionAdjustment = CONDITION_ADJUSTMENTS[adjustments.condition];
    currentValue *= conditionAdjustment;
    console.log('After condition adjustment:', { condition: adjustments.condition, adjustment: conditionAdjustment, value: currentValue });
  }

  // Step 5: Apply market trend adjustment if make is provided
  if (adjustments?.make) {
    const marketAdjustment = MARKET_TREND_ADJUSTMENTS[adjustments.make] || 1.0;
    currentValue *= marketAdjustment;
    console.log('After market trend adjustment:', { make: adjustments.make, adjustment: marketAdjustment, value: currentValue });
  }

  // Round to nearest hundred
  currentValue = Math.round(currentValue / 100) * 100;
  
  console.log('Final calculated value:', currentValue);
  return currentValue;
};

export const formatCurrency = (value: string | null | number): string => {
  if (value === null || value === undefined || value === '') return 'N/A';
  if (typeof value === 'number') {
    if (isNaN(value) || value === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  if (isNaN(numericValue) || numericValue === 0) return 'N/A';
  return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
  }).format(numericValue);
};
