export default function distanceFormat(number) {
  if (number < 1000) {
    return number.toFixed(1) + " KM";
  } else {
    return number.toFixed(0) + " KM";
  }
}
