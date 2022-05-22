export function norm(value: number, min: number, max: number) {
  return (value - min) / (max - min);
}

export function randomFloatFromInterval(min: number, max: number, fractionDigits: number) {
  const fractionMultiplier = 10 ** fractionDigits
  return Math.round(
    (Math.random() * (max - min) + min) * fractionMultiplier,
  ) / fractionMultiplier
}

export function smallest<T>(array: T[], getProperty: (data: T) => number) {
  return array.map(item => getProperty(item)).reduce((acc, field) => Math.min(acc, field), Number.MAX_VALUE)
}

export function largest<T>(array: T[], getProperty: (data: T) => number) {
  return array.map(item => getProperty(item)).reduce((acc, field) => Math.max(acc, field), Number.MIN_VALUE)
}
