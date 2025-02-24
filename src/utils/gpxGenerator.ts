
export const generateGPX = (
  startPoint: string,
  destination: string,
  route: any,
  fuelStops: Array<{ name: string; location: [number, number]; distance: number }>
): string => {
  const currentDate = new Date().toISOString();
  
  // Start GPX XML structure
  let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Route Planner GPX Generator"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>Route from ${startPoint} to ${destination}</name>
    <time>${currentDate}</time>
  </metadata>
  <rte>
    <name>${startPoint} to ${destination}</name>\n`;

  // Add route points
  route.geometry.coordinates.forEach((coord: [number, number], index: number) => {
    gpx += `    <rtept lat="${coord[1]}" lon="${coord[0]}">
      <ele>0</ele>
      <time>${currentDate}</time>
    </rtept>\n`;
  });

  gpx += `  </rte>\n`;

  // Add fuel stops as waypoints
  fuelStops.forEach((stop) => {
    gpx += `  <wpt lat="${stop.location[1]}" lon="${stop.location[0]}">
    <name>${stop.name}</name>
    <desc>Fuel stop - ${stop.distance} miles from start</desc>
    <time>${currentDate}</time>
  </wpt>\n`;
  });

  // Close GPX structure
  gpx += `</gpx>`;

  return gpx;
};

export const downloadGPX = (
  startPoint: string,
  destination: string,
  route: any,
  fuelStops: Array<{ name: string; location: [number, number]; distance: number }>
) => {
  const gpxContent = generateGPX(startPoint, destination, route, fuelStops);
  const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `route_${startPoint.replace(/[^a-z0-9]/gi, '_')}_to_${destination.replace(/[^a-z0-9]/gi, '_')}.gpx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
