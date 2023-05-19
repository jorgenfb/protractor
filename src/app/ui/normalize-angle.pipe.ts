import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'normalizeAngle',
  standalone: true,
})
export class NormalizeAnglePipe implements PipeTransform {
  transform(
    value: number | string | null | undefined,
  ): number | null {
    if (!isValue(value)) return null;

    try {
      const num = strToNumber(value);
      // Normalize value to +/- 180 degrees
      return num - 360 * Math.floor((num + 180) / 360);
    } catch {
      // Ignore
    }
    return null;
  }
}

function isValue(
  value: number | string | null | undefined
): value is number | string {
  return !(value == null || value === '' || value !== value);
}

/**
 * Transforms a string into a number (if needed).
 */
function strToNumber(value: number | string): number {
  // Convert strings to numbers
  if (typeof value === 'string' && !isNaN(Number(value) - parseFloat(value))) {
    return Number(value);
  }
  if (typeof value !== 'number') {
    throw new Error(`${value} is not a number`);
  }
  return value;
}
