
export const decodeVINYear = (vin: string): string => {
  const yearChar = vin.charAt(9);
  const yearMap: { [key: string]: string } = {
    'A': '2010', 'B': '2011', 'C': '2012', 'D': '2013',
    'E': '2014', 'F': '2015', 'G': '2016', 'H': '2017',
    'J': '2018', 'K': '2019', 'L': '2020', 'M': '2021',
    'N': '2022', 'P': '2023', 'R': '2024',
    '1': '2001', '2': '2002', '3': '2003', '4': '2004',
    '5': '2005', '6': '2006', '7': '2007', '8': '2008',
    '9': '2009'
  };
  return yearMap[yearChar] || '';
};

export const decodeVINMake = (vin: string): string => {
  const makePrefix = vin.substring(0, 3);
  const makeMap: { [key: string]: string } = {
    'JYA': 'Yamaha',
    'KAW': 'Kawasaki',
    'JH2': 'Honda',
    'JSB': 'Suzuki',
    'KTM': 'KTM',
    'WB1': 'BMW',
    'ZDM': 'Ducati',
    'MEH': 'Harley-Davidson',
    'SMT': 'Triumph',
    '1HD': 'Harley-Davidson',
  };
  return makeMap[makePrefix] || '';
};
