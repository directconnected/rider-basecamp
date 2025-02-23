
export const capitalizeWords = (str: string) => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const getFallbackImage = (byway: string) => {
  const fallbackImages = [
    'photo-1542332213-31f87348057f', // mountain road
    'photo-1605048388166-c1f369958b63', // forest road
    'photo-1506965827514-ae0b5846a40f', // scenic road
    'photo-1517825738774-7de9915bed53', // desert road
    'photo-1482938289607-e9573fc25ebb', // mountain vista
    'photo-1544198365-f5d60b6d8190', // coastal road
    'photo-1580403318832-c714b87ca186', // canyon road
    'photo-1496275068113-fff8c90750d1', // rural road
    'photo-1498598457418-36ef20772bb9', // sunrise road
    'photo-1510253687831-0f982d7862fc', // mountain pass
    'photo-1517524008697-84bbe3c3fd98', // forest trail
    'photo-1569931359394-aa01c50c0e98', // desert vista
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
