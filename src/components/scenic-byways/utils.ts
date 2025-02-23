
export const capitalizeWords = (str: string) => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const getFallbackImage = (state: string) => {
  const fallbackImages = [
    'photo-1470071459604-3b5ec3a7fe05',
    'photo-1472396961693-142e6e269027',
    'photo-1433086966358-54859d0ed716',
    'photo-1509316975850-ff9c5deb0cd9',
    'photo-1482938289607-e9573fc25ebb'
  ];
  
  const index = Math.abs(state.charCodeAt(0)) % fallbackImages.length;
  return `https://images.unsplash.com/${fallbackImages[index]}?auto=format&fit=crop&w=800&h=400`;
};
