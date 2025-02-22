
export const calculateCurrentValue = (msrp: number): number => {
  if (typeof msrp !== 'number' || isNaN(msrp) || msrp <= 0) {
    console.error('Invalid MSRP:', msrp);
    return 0;
  }
  
  const currentValue = Math.round(msrp * 0.6);
  console.log('Calculated value:', { msrp, currentValue });
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
