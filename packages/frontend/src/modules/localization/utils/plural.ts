/**
 * Formatter for plural expressions.
 */
import msg from './msg';

export default function plural(key: string): (count: number) => string {
  const zero = msg(`plural.${key}.zero`);
  const one = msg(`plural.${key}.one`);
  const two = msg(`plural.${key}.two`);

  return (count: number): string => {
    if (count === 1) {
      return one;
    }

    if (count > 10 && count < 20) {
      return zero;
    }

    switch (count % 10) {
      case 0:
      case 1:
        return zero;
      case 2:
      case 3:
      case 4:
        return two;
      default:
        return zero;
    }
  };
}
