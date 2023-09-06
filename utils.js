// Define a function to convert UTM coordinates to lat/lng
export function convertUTMToLatLng(eastings, northings) {
  // Determine the UTM zone based on longitude
  function determineUTMZone(longitude) {
    // UTM zone width (6 degrees)
    const zoneWidth = 6;

    // Calculate the zone number
    let zoneNumber = Math.floor((180 + longitude) / zoneWidth) + 1;

    // Adjust the zone number if longitude is negative
    if (longitude < 0) {
      zoneNumber += 30;
    }

    // Ensure the zone number is within the valid UTM zone range (1 to 60)
    zoneNumber = Math.min(Math.max(zoneNumber, 1), 60);

    return zoneNumber;
  }

  // Example UTM zone number (replace with your data)
  const longitude = -74.006; // Replace with the longitude of your data
  const zoneNumber = determineUTMZone(longitude);

  // WGS84 ellipsoid parameters (for UTM Zone 33N, change for other zones)
  const a = 6378137; // Semi-major axis
  const e = 0.00669438; // Eccentricity

  // UTM parameters
  const k0 = 0.9996; // Scale factor
  const eastingsOffset = 500000; // False eastings for northern hemisphere

  // UTM coordinates
  const x = parseFloat(eastings);
  const y = parseFloat(northings);

  // Calculate the meridian arc
  const M = y / k0;

  // Calculate the footpoint latitude
  const mu = M / (a * (1 - e / 4 - (3 * e * e) / 64 - (5 * e * e * e) / 256));
  const e1 = (1 - Math.sqrt(1 - e)) / (1 + Math.sqrt(1 - e));
  const J1 = (3 * e1) / 2 - (27 * e1 * e1 * e1) / 32;
  const J2 = (21 * e1 * e1) / 16 - (55 * e1 * e1 * e1 * e1) / 32;
  const J3 = (151 * e1 * e1 * e1) / 96;

  const phi1 =
    mu + J1 * Math.sin(2 * mu) + J2 * Math.sin(4 * mu) + J3 * Math.sin(6 * mu);

  // Calculate the difference in longitudes
  const t = Math.tan(phi1);
  const n1 = a / Math.sqrt(1 - e * Math.sin(phi1) * Math.sin(phi1));
  const r1 =
    (a * (1 - e)) / Math.pow(1 - e * Math.sin(phi1) * Math.sin(phi1), 1.5);
  const d = x / (n1 * k0);

  const lat =
    phi1 -
    ((n1 * Math.tan(phi1)) / r1) *
      ((d * d) / 2 - ((5 + 3 * t * t + 10 * C1) * d * d * d * d) / 24);

  const lon = (d - ((1 + 2 * t * t + C1) * d * d * d) / 6) / Math.cos(phi1);

  // Convert latitude and longitude from radians to degrees
  const latDegrees = (lat * 180) / Math.PI;
  const lonDegrees = (lon * 180) / Math.PI + (zoneNumber - 1) * 6 - 180;

  return { lat: latDegrees, lng: lonDegrees };
}

// Example usage for a data point
// const eastings = "530097.000"; // Replace with your data
// const northings = "180000.000"; // Replace with your data

// const latLng = convertUTMToLatLng(eastings, northings);
// console.log("Latitude:", latLng.lat);
// console.log("Longitude:", latLng.lng);
