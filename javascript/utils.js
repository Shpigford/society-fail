// Random number generation
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

// Time conversion functions
export function hoursToTime(hours) {
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return { days, hours: remainingHours };
}

export function timeToHours(days, hours) {
  return days * 24 + hours;
}

export function formatTime(days, hours) {
  return `Day ${days}, Hour ${hours}`;
}

// Other utility functions
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function percentageToDecimal(percentage) {
  return percentage / 100;
}

export function decimalToPercentage(decimal) {
  return decimal * 100;
}