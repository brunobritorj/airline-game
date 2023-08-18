export default function distanceFormat(number) {
  if (number < 1000) {
    return number + " m";
  } else {
    return (number / 1000).toFixed(2) + " KM";
  }
}
