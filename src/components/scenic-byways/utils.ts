
export const capitalizeWords = (str: string) => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const getFallbackImage = (byway: string) => {
  const fallbackImages = [
    'photo-1470071459604-3b5ec3a7fe05', // mountain road
    'photo-1472396961693-142e6e269027', // forest road
    'photo-1433086966358-54859d0ed716', // scenic forest
    'photo-1509316975850-ff9c5deb0cd9', // desert road
    'photo-1482938289607-e9573fc25ebb', // mountain vista
    'photo-1544198365-f5d60b6d8190', // coastal road
    'photo-1552849397-776c5356d821', // canyon road
    'photo-1552083375-1447ce886485', // rural road
    'photo-1551969014-7d2c4cddf0b6', // sunrise road
    'photo-1549216963-72c182964972', // mountain pass
    'photo-1517524008697-84bbe3c3fd98', // forest trail
    'photo-1516822669470-74b7c5c37b63', // desert vista
    'photo-1534447677768-be436bb09401', // ocean road
    'photo-1527489377706-5bf97e608852', // mountain valley
    'photo-1508739773434-c26b3d09e071', // scenic overlook
  ];
  
  // Use the byway name to generate a consistent index
  let index = 0;
  for (let i = 0; i < byway.length; i++) {
    index += byway.charCodeAt(i);
  }
  return `https://images.unsplash.com/${fallbackImages[index % fallbackImages.length]}?auto=format&fit=crop&w=800&h=400`;
};
