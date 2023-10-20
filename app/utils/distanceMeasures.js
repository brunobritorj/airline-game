export default function distanceInKm(coord1, coord2) {
  const R = 6371; // Radius of the Earth in kilometers
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  const distance = R * c; // Distance in kilometers
  return Number(distance.toFixed(2));
}

/*
- How to use:
const coord1 = [latitude1, longitude1]; // First coordinate
const coord2 = [latitude2, longitude2]; // Second coordinate
const distance = haversineDistance(coord1, coord2);
console.log(distance);
*/
