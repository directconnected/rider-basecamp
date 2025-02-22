
export const calculateCurrentValue = (msrp: number | null): number => {
  // If msrp is null or not a number, return null
  if (msrp === null || typeof msrp !== 'number' || isNaN(msrp)) {
    console.log('Invalid MSRP value:', msrp);
    return 0;
  }
  
  // Calculate 60% of MSRP
  const currentValue = Math.round(msrp * 0.6);
  console.log('Calculated current value:', { msrp, currentValue });
  return currentValue;
};

export const formatCurrency = (value: string | null | number): string => {
  if (value === null || value === '') return 'N/A';
  if (typeof value === 'number') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
  }).format(numericValue);
};
