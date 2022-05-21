export function norm(value: number, min: number, max: number) {
  return (value - min) / (max - min);
}

export function randomFloatFromInterval(min: number, max: number, fractionDigits: number) {
  const fractionMultiplier = 10 ** fractionDigits
  return Math.round(
    (Math.random() * (max - min) + min) * fractionMultiplier,
  ) / fractionMultiplier
}
