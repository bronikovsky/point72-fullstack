import { dec, inc, map, slice } from 'ramda';

/**
 * Returns elements of the list around a specific pivot point.
 *
 * eg.:
 * sliceAround(5, 3, ['a', 'b', 'c', 'd', 'e', 'f', 'g'] // => ['b', 'c', 'd', 'e', 'f']
 * sliceAround(5, 0, ['a', 'b', 'c', 'd', 'e', 'f', 'g'] // => ['a', 'b', 'c', 'd', 'e']
 */
export default function sliceAround<T>(max: number, index: number, list: T[]): T[] {
  if (list.length <= max) {
    return list;
  }

  const maxIndex = list.length - 1;
  const isEven = max % 2 === 0;
  const before = Math.floor((max - 1) / 2);
  const after = isEven ? before + 1 : before;

  let range = [index - before, index + after];

  while (range[0] < 0 || range[1] > maxIndex) {
    const op = range[0] < 0 ? inc : dec;

    range = map(op, range);
  }

  return slice(range[0], range[1] + 1, list);
}
