
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
