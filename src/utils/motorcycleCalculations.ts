
export const calculateCurrentValue = (msrp: number | null): number => {
  if (!msrp) return 0;
  return Math.round(msrp * 0.6);
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
