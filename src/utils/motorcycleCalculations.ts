
const INITIAL_DEPRECIATION_RATE = 0.18; // 18% first year depreciation
const ANNUAL_DEPRECIATION_RATE = 0.08; // 8% annual depreciation after first year
const CURRENT_YEAR = new Date().getFullYear();

export const calculateCurrentValue = (msrp: number, year?: number | null): number => {
  if (typeof msrp !== 'number' || isNaN(msrp) || msrp <= 0) {
    console.error('Invalid MSRP:', msrp);
    return 0;
  }

  // If no year provided, assume current year
  const modelYear = year || CURRENT_YEAR;
  const yearsOwned = CURRENT_YEAR - modelYear;
  
  console.log('Calculating depreciation for:', { msrp, modelYear, yearsOwned });

  // Step 1: Apply initial depreciation (first year)
  let currentValue = msrp * (1 - INITIAL_DEPRECIATION_RATE);
  console.log('After initial depreciation:', currentValue);

  // Step 2: Apply annual depreciation for remaining years
  if (yearsOwned > 1) {
    currentValue = currentValue * Math.pow(1 - ANNUAL_DEPRECIATION_RATE, yearsOwned - 1);
    console.log('After annual depreciation:', currentValue);
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

// Future enhancements that could be added:
// - Mileage adjustment factor
// - Condition adjustment factor
// - Market trend adjustment
// These would require additional parameters and business logic to implement properly
