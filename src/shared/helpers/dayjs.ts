import { Duration } from "dayjs/plugin/duration"

// eslint-disable-next-line import/prefer-default-export
export function humanize(duration: Duration): string {
  const humanizedText = duration.format('H[h] m[m] s[s] SSS[ms]')
    .replace(/\b0y\b/, '')
    .replace(/\b0m\b/, '')
    .replace(/\b0d\b/, '')
    .replace(/\b0h\b/, '')
    .replace(/\b0s\b/, '')
    .replace(/\b000ms\b/, '')
    .trim()
  return humanizedText === '' ? '< 000ms' : humanizedText
}
