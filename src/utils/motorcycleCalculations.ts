
export const calculateCurrentValue = (msrp: number | null): number => {
  if (!msrp || isNaN(msrp)) return 0;
  // Ensuring we're working with a valid number
  const numericMsrp = Number(msrp);
  return Math.round(numericMsrp * 0.6);
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
